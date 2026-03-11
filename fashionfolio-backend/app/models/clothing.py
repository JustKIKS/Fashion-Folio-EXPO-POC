from dataclasses import dataclass


@dataclass
class Clothing:
    id: int
    user_id: int
    type: str
    color: str
    style: str
    pattern: str
    brand: str
    season: str
    photo_url: str | None
    created_at: str
