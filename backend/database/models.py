from pydantic import BaseModel
from datetime import datetime

class Todo(BaseModel):
    title:str
    description: str
    is_completed: bool = False
    is_deleted: bool = False
    created_at:int= int(datetime.timestamp( datetime.now()) )
    updated_at:int = int(datetime.timestamp( datetime.now()) )