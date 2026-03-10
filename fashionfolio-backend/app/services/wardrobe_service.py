import sqlite3
from app.schemas.clothing import ClothingCreate, ClothingUpdate


def get_wardrobe(db: sqlite3.Connection, user_id: int) -> list[dict]:
    rows = db.execute(
        "SELECT * FROM clothing WHERE user_id = ? ORDER BY created_at DESC",
        (user_id,),
    ).fetchall()
    return [dict(r) for r in rows]


def get_clothing(db: sqlite3.Connection, clothing_id: int, user_id: int) -> dict | None:
    row = db.execute(
        "SELECT * FROM clothing WHERE id = ? AND user_id = ?",
        (clothing_id, user_id),
    ).fetchone()
    return dict(row) if row else None


def create_clothing(db: sqlite3.Connection, user_id: int, data: ClothingCreate) -> dict:
    cursor = db.execute(
        """INSERT INTO clothing (user_id, type, color, style, pattern, brand, season, photo_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (user_id, data.type, data.color, data.style,
         data.pattern, data.brand, data.season, data.photo_url),
    )
    db.commit()
    row = db.execute("SELECT * FROM clothing WHERE id = ?", (cursor.lastrowid,)).fetchone()
    return dict(row)


def update_clothing(
    db: sqlite3.Connection, clothing_id: int, user_id: int, data: ClothingUpdate
) -> dict | None:
    # Construire dynamiquement les champs à mettre à jour (seulement ceux fournis)
    fields = {k: v for k, v in data.model_dump().items() if v is not None}
    if not fields:
        return get_clothing(db, clothing_id, user_id)

    set_clause = ", ".join(f"{k} = ?" for k in fields)
    values = list(fields.values()) + [clothing_id, user_id]

    db.execute(
        f"UPDATE clothing SET {set_clause} WHERE id = ? AND user_id = ?",
        values,
    )
    db.commit()
    return get_clothing(db, clothing_id, user_id)


def delete_clothing(db: sqlite3.Connection, clothing_id: int, user_id: int) -> bool:
    cursor = db.execute(
        "DELETE FROM clothing WHERE id = ? AND user_id = ?",
        (clothing_id, user_id),
    )
    db.commit()
    return cursor.rowcount > 0
