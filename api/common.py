# this file is for all dependencies for other files to use
import hashlib
import os
import random
import re
import uuid
from datetime import datetime, timezone
from typing import Annotated, List, Optional

import bcrypt
import dotenv
from fastapi import APIRouter, FastAPI, HTTPException, Query, Request, status
from fastapi.responses import JSONResponse
from getstream import Stream
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, constr
from slowapi import Limiter
from slowapi.util import get_remote_address
from pymongo import MongoClient
from models import Package, PackageEdit
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
router = APIRouter()

dotenv.load_dotenv()

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
import os

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "testdb"

client = AsyncIOMotorClient(MONGO_URI)
db = client["cypi"]

# helpers
from bson import ObjectId

from bson import ObjectId

def serialize_doc(doc: dict, exclude: list[str] = None) -> dict:
    """
    Convert a MongoDB document into a JSON-serializable dict.
    Optionally exclude certain fields.
    """
    if not doc:
        return None

    exclude = exclude or []
    serialized = {}
    for key, value in doc.items():
        if key in exclude:
            continue
        if isinstance(value, ObjectId):
            serialized[key] = str(value)
        elif isinstance(value, dict):
            serialized[key] = serialize_doc(value, exclude=exclude)
        elif isinstance(value, list):
            serialized[key] = [
                serialize_doc(v, exclude=exclude) if isinstance(v, dict) else v
                for v in value
            ]
        else:
            serialized[key] = value

    return serialized


def serialize_docs(docs: list[dict], exclude: list[str] = None) -> list[dict]:
    return [serialize_doc(doc, exclude=exclude) for doc in docs]

def hash_edit_code(edit_code: str) -> str:
    """Return a SHA-256 hash of the provided edit code."""
    return hashlib.sha256(edit_code.encode()).hexdigest()
