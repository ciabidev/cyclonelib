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
    # Fetch package (handle int/string RHID)
    pkg = await db.packages.find_one({"rhid": rhid}) or \
          await db.packages.find_one({"rhid": str(rhid)})
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")

    # Verify edit_code (trim whitespace)
    if pkg["edit_code"] != hash_edit_code(package.edit_code.strip()):
        raise HTTPException(status_code=403, detail="Edit code does not match")

    # Build update dict with only provided fields
    update_fields = {}
    for field in ["name", "description", "rhid"]:
        value = getattr(package, field, None)
        if value is not None:
            update_fields[field] = value

    if update_fields:
        await db.packages.update_one({"_id": pkg["_id"]}, {"$set": update_fields})

    # Fetch updated package
    updated_pkg = await db.packages.find_one({"_id": pkg["_id"]})

    # Return serialized package without edit_code
    return JSONResponse(status_code=200, content=serialize_doc(updated_pkg, exclude=["edit_code"]))
