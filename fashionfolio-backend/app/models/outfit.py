from dataclasses import dataclass


@dataclass
class Outfit:
    id: int
    user_id: int
    clothing_ids: str
    description: str
    is_published: bool
    created_at: str
