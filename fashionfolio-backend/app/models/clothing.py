from dataclasses import dataclass


@dataclass
class Clothing:
    id: int
    user_id: int
    type: str        # "top", "bottom", "shoes", "accessory"
    color: str
    style: str       # "casual", "formel", "sportswear"
    pattern: str     # "uni", "rayé", "floral"
    brand: str
    season: str      # "été", "hiver", "mi-saison", "all-season"
    photo_url: str | None
    created_at: str
