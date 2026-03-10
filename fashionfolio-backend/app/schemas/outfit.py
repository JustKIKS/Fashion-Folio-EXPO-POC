from pydantic import BaseModel
from typing import List


class OutfitRead(BaseModel):
    id: int
    user_id: int
    clothing_ids: List[int]
    description: str
    is_published: bool
    created_at: str
