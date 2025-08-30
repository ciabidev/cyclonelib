from common import *
from models import Package, PackageEdit, PackageCreate
from fastapi import APIRouter
import models
router = APIRouter()

@router.get("/packages")
async def read_packages(
    name: str | None = Query(None, description="Filter packages whose name contains this string"),
    rhid: str | None = Query(None, description="Filter packages whose rhid contains this string")
):
    """
    Get a list of packages.
    Optionally filter by name or rhid.
    """
    # Build MongoDB query dynamically
    query = {}

    if name:
        query["name"] = {"$regex": name, "$options": "i"}  # case-insensitive contains

    if rhid:
        query["rhid"] = {"$regex": rhid, "$options": "i"}

    docs = await db.packages.find(query).to_list(length=100)
    result = serialize_docs(docs, exclude=["edit_code"])
    return result

@router.post("/packages")
async def create_package(package: PackageCreate):
    """
    create a package its obvious
    """
    package_dict = package.model_dump()
    package_dict["edit_code"] = hash_edit_code(package_dict["edit_code"])

    existing_name = await db.packages.find_one({"name": package_dict["name"]})
    if existing_name:
        raise HTTPException(status_code=409, detail="Package name is already taken")
    
    existing_rhid = await db.packages.find_one({"rhid": package_dict["rhid"]})
    if existing_rhid:
        raise HTTPException(status_code=409, detail="Package RHID is already taken. If someone has uploaded your package here and you want it removed, please [contact us](https://tally.so/r/mVXylJ). Support is checked regularly.")
    
    created = await db.packages.insert_one(package_dict)
    result = await db.packages.find_one({"_id": created.inserted_id})
    return JSONResponse(status_code=201, content=serialize_doc(result))

from fastapi import HTTPException, status
from fastapi.responses import JSONResponse

@router.put("/packages/{rhid}")
async def edit_package(rhid: int, package: PackageEdit):
    """
    Edit an existing package. Only updates fields provided by the user.
    """
    package_dict = package.model_dump()
    existing_package = await db.packages.find_one({"rhid": rhid})
    if not existing_package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    # Verify edit_code (trim whitespace)
    if existing_package["edit_code"] != hash_edit_code(package.edit_code.strip()):
        raise HTTPException(status_code=403, detail="Edit code does not match")
    
    # Build the fields to update only from provided (non-None) values
    update_fields = {}

    # Name: only validate uniqueness if provided and different from current
    if package_dict.get("name") is not None:
        if package_dict["name"] != existing_package.get("name"):
            existing_name = await db.packages.find_one({"name": package_dict["name"], "_id": {"$ne": existing_package["_id"]}})
            if existing_name:
                raise HTTPException(status_code=409, detail="Package name is already taken")
        update_fields["name"] = package_dict["name"]

    # Description
    if package_dict.get("description") is not None:
        update_fields["description"] = package_dict["description"]

    # RHID: only validate uniqueness if provided and different from current
    if package_dict.get("rhid") is not None:
        if package_dict["rhid"] != existing_package.get("rhid"):
            existing_rhid = await db.packages.find_one({"rhid": package_dict["rhid"], "_id": {"$ne": existing_package["_id"]}})
            if existing_rhid:
                raise HTTPException(status_code=409, detail="Package RHID is already taken. If someone has uploaded your package here and you want it removed, please [contact us](https://tally.so/r/mVXylJ). Support is checked regularly.")
        update_fields["rhid"] = package_dict["rhid"]

    # If nothing to update, return the existing package
    if not update_fields:
        return JSONResponse(status_code=200, content=serialize_doc(existing_package, exclude=["edit_code"]))

    # Apply the update using the existing package _id
    await db.packages.update_one({"_id": existing_package["_id"]}, {"$set": update_fields})

    # Fetch updated package
    updated_package = await db.packages.find_one({"_id": existing_package["_id"]})

    # Return serialized package without edit_code
    return JSONResponse(status_code=200, content=serialize_doc(updated_package, exclude=["edit_code"]))
