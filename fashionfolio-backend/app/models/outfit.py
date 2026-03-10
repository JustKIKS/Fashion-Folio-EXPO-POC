from dataclasses import dataclass


@dataclass
class Outfit:
    id: int
    user_id: int
    clothing_ids: str   # JSON stocké en texte : "[1, 2, 3]"
    description: str
    is_published: bool
    created_at: str
