from fastapi import APIRouter, Depends
from app.database import get_db
from app.services.llm_service import get_outfit_suggestion
import json

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/")
def chat(message: str, user_id: int, conn=Depends(get_db)):

    # 1. Récupère le dressing depuis la DB
    rows = conn.execute(
        "SELECT * FROM clothing WHERE user_id = ?", (user_id,)
    ).fetchall()
    wardrobe = [dict(row) for row in rows]

    # 2. Récupère ou crée la conversation
    conv = conn.execute(
        "SELECT * FROM conversations WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        (user_id,)
    ).fetchone()

    if conv:
        history = json.loads(conv["messages"])
        conv_id = conv["id"]
    else:
        history = []
        cursor = conn.execute(
            "INSERT INTO conversations (user_id, messages) VALUES (?, ?)",
            (user_id, "[]")
        )
        conn.commit()
        conv_id = cursor.lastrowid

    # 3. Appelle le LLM avec le dressing + l'historique
    result = get_outfit_suggestion(wardrobe, history, message)

    # 4. Sauvegarde le message user + la réponse en DB
    history.append({"role": "user",      "content": message})
    history.append(
        {"role": "assistant", "content": json.dumps(result, ensure_ascii=False)})

    conn.execute(
        "UPDATE conversations SET messages = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (json.dumps(history, ensure_ascii=False), conv_id)
    )

    # 5. Sauvegarde la tenue dans outfits + outfit_items
    if result.get("outfit") and not result.get("out_of_scope"):
        cursor = conn.execute(
            "INSERT INTO outfits (user_id, description) VALUES (?, ?)",
            (user_id, result.get("message", ""))
        )
        outfit_id = cursor.lastrowid

        outfit = result["outfit"]
        position = 1
        for slot in ["top", "bottom", "shoes", "accessory"]:
            item = outfit.get(slot)
            if item and item.get("id"):
                conn.execute(
                    "INSERT INTO outfit_items (outfit_id, clothing_id, position) VALUES (?, ?, ?)",
                    (outfit_id, item["id"], position)
                )
            position += 1

    conn.commit()

    return result
