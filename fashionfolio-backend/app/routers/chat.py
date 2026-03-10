from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.llm_service import get_outfit_suggestion

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/")
def chat(message: str, db: Session = Depends(get_db)):

    # Pour l'instant, dressing hardcodé pour tester
    wardrobe = [
        {"id": 1, "type": "top",    "name": "T-shirt blanc",
            "color": "blanc",  "style": "casual", "brand": "Zara"},
        {"id": 2, "type": "bottom", "name": "Jean slim bleu",
            "color": "bleu",   "style": "casual", "brand": "Levi's"},
        {"id": 3, "type": "shoes",  "name": "Sneakers Nike",
            "color": "blanc",  "style": "casual", "brand": "Nike"},
    ]
    history = []

    result = get_outfit_suggestion(wardrobe, history, message)
    return result
