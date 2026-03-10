from fastapi import APIRouter, Depends
from app.database import get_db


router = APIRouter(prefix="/wardrobe", tags=["wardrobe"])


@router.post("/")
def add_clothe(item: dict, user_id: int, conn=Depends(get_db)):
    cursor = conn.execute(
        "INSERT INTO clothing (user_id, type, color, style, pattern, brand, season) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (user_id, item["type"], item["color"], item["style"],
         item["pattern"], item["brand"], item["season"])
    )
    conn.commit()
    return {"id": cursor.lastrowid}
