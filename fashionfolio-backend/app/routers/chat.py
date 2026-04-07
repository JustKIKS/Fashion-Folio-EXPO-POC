from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from app.services.llm_service import get_outfit_suggestion
from pydantic import BaseModel  # <--- Indispensable pour lire le JSON
import json

# Le préfixe /chat combiné au @router.post("/") crée l'URL : http://IP:8000/chat/
router = APIRouter(prefix="/chat", tags=["chat"])

# On définit ce que le backend attend (doit être identique à ce que le front envoie)


class ChatRequest(BaseModel):
    message: str
    user_id: int


@router.post("/")
def chat(chat_data: ChatRequest, conn=Depends(get_db)):
    # Récupère les données depuis ton nouveau nom
    message = chat_data.message
    user_id = chat_data.user_id

    # 1. Pull le dressing depuis la DB
    rows = conn.execute(
        "SELECT * FROM clothing WHERE user_id = ?", (user_id,)
    ).fetchall()

    # Transformation des lignes SQL en dictionnaires Python
    wardrobe = [dict(row) for row in rows]

    # 2. Pull ou crée la conversation
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

    # 3. Appel au service LLM (Gemini) avec le dressing + l'historique
    result = get_outfit_suggestion(wardrobe, history, message)

    # 4. Sauvegarde du message user + la réponse de l'IA en DB
    history.append({"role": "user", "content": message})
    history.append({
        "role": "assistant",
        "content": json.dumps(result, ensure_ascii=False)
    })

    conn.execute(
        "UPDATE conversations SET messages = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (json.dumps(history, ensure_ascii=False), conv_id)
    )

    # 5. Sauvegarde de la tenue suggérée dans les tables outfits + outfit_items
    if result.get("outfit") and not result.get("out_of_scope"):
        cursor = conn.execute(
            "INSERT INTO outfits (user_id, description) VALUES (?, ?)",
            (user_id, result.get("message", ""))
        )
        outfit_id = cursor.lastrowid

        outfit = result["outfit"]
        position = 1
        # On parcourt les pièces de la tenue (top, bottom, etc.)
        for slot in ["top", "bottom", "shoes", "accessory"]:
            item = outfit.get(slot)
            if item and item.get("id"):
                conn.execute(
                    "INSERT INTO outfit_items (outfit_id, clothing_id, position) VALUES (?, ?, ?)",
                    (outfit_id, item["id"], position)
                )
            position += 1

    # On valide toutes les écritures en base de données
    conn.commit()

    # On renvoie le dictionnaire 'result' (le front y trouvera data.message)
    return result
