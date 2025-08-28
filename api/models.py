from common import *

class Package(BaseModel):
    name: str
    description: str
    rhid: int
    
class PackageCreate(BaseModel):
    edit_code: str
    name: str
    description: str
    rhid: int
class PackageEdit(BaseModel):
    edit_code: str
    name: Optional[str] = None
    description: Optional[str] = None
    rhid: Optional[int] = None