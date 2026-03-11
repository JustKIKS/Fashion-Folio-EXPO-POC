from fastapi import APIRouter, Depends
from app.database import get_db
from app.services.llm_service import get_outfit_suggestion

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/")
def chat(message: str, user_id: int, conn=Depends(get_db)):

    # Remplace le hardcodé par la vraie DB
    rows = conn.execute(
        "SELECT * FROM clothing WHERE user_id = ?", (user_id,)
    ).fetchall()
    wardrobe = [dict(row) for row in rows]

    history = []  # à brancher aussi plus tard

    result = get_outfit_suggestion(wardrobe, history, message)
    return result
