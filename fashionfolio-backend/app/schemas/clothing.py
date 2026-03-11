from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ClothingCreate(BaseModel):
    type: str
    color: str
    style: str
    pattern: Optional[str] = None
    brand: Optional[str] = None
    season: Optional[str] = None
    photo_url: Optional[str] = None


class ClothingUpdate(BaseModel):
    type: Optional[str] = None
    color: Optional[str] = None
    style: Optional[str] = None
    pattern: Optional[str] = None
    brand: Optional[str] = None
    season: Optional[str] = None
    photo_url: Optional[str] = None


class ClothingOut(BaseModel):
    id: int
    user_id: int
    type: str
    color: str
    style: str
    pattern: Optional[str] = None
    brand: Optional[str] = None
    season: Optional[str] = None
    photo_url: Optional[str] = None
    created_at: datetime
