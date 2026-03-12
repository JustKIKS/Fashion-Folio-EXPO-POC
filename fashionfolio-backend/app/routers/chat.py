from fastapi import APIRouter, Depends
from app.database import get_db
from app.auth_utils import get_current_user
from app.services.llm_service import get_outfit_suggestion

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/")
def chat(message: str, conn=Depends(get_db), current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]

    # Remplace le hardcodé par la vraie DB
    rows = conn.execute(
        "SELECT * FROM clothing WHERE user_id = ?", (user_id,)
    ).fetchall()
    wardrobe = [dict(row) for row in rows]

    history = []  # à brancher aussi plus tard

    result = get_outfit_suggestion(wardrobe, history, message)
    return result
