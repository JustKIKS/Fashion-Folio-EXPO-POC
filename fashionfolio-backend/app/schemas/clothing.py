from pydantic import BaseModel


class ClothingCreate(BaseModel):    # ajout d'un vetement
    type: str       # 'haut' | 'bas' | 'chaussures' | 'accessoire'
    color: str
    style: str      # 'casual' | 'formel' | 'sportswear' | 'soirée'
    pattern: str | None = None
    brand: str | None = None
    season: str | None = None
    photo_url: str | None = None


class ClothingUpdate(BaseModel):
    type: str | None = None
    color: str | None = None
    style: str | None = None
    pattern: str | None = None
    brand: str | None = None
    season: str | None = None
    photo_url: str | None = None


class ClothingOut(BaseModel):       # lecture d'un vetement
    id: int
    user_id: int
    type: str
    color: str
    style: str
    pattern: str | None
    brand: str | None
    season: str | None
    photo_url: str | None
    created_at: str

    model_config = {"from_attributes": True}
