from fastapi import APIRouter, Depends, HTTPException
import sqlite3

from app.database import get_db
from app.auth_utils import get_current_user
from app.schemas.clothing import ClothingCreate, ClothingUpdate, ClothingOut
from app.services import wardrobe_service
from fastapi import UploadFile, File
from app.services.llm_service import analyze_clothing_photo

router = APIRouter(prefix="/wardrobe", tags=["wardrobe"])


@router.get("/", response_model=list[ClothingOut])
def list_wardrobe(
    db: sqlite3.Connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return wardrobe_service.get_wardrobe(db, current_user["id"])


@router.get("/{clothing_id}", response_model=ClothingOut)
def get_item(
    clothing_id: int,
    db: sqlite3.Connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = wardrobe_service.get_clothing(db, clothing_id, current_user["id"])
    if not item:
        raise HTTPException(status_code=404, detail="Vêtement introuvable")
    return item


@router.post("/", response_model=ClothingOut, status_code=201)
def add_item(
    payload: ClothingCreate,
    db: sqlite3.Connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return wardrobe_service.create_clothing(db, current_user["id"], payload)


@router.post("/upload-photo")
async def upload_photo(user_id: int, file: UploadFile = File(...)):

    image_bytes = await file.read()
    attributes = analyze_clothing_photo(image_bytes)

    # Ouvre une connexion directement dans la route
    from app.database import get_connection
    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO clothing (user_id, type, color, style, pattern, brand, season) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (user_id, attributes["type"], attributes["color"], attributes["style"],
         attributes.get("pattern"), attributes.get("brand"), attributes.get("season"))
    )
    conn.commit()
    conn.close()

    return {
        "message": "Vêtement ajouté automatiquement ✅",
        "id": cursor.lastrowid,
        "attributes": attributes
    }


@router.patch("/{clothing_id}", response_model=ClothingOut)
def update_item(
    clothing_id: int,
    payload: ClothingUpdate,
    db: sqlite3.Connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = wardrobe_service.update_clothing(
        db, clothing_id, current_user["id"], payload)
    if not item:
        raise HTTPException(status_code=404, detail="Vêtement introuvable")
    return item


@router.delete("/{clothing_id}", status_code=204)
def delete_item(
    clothing_id: int,
    db: sqlite3.Connection = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    deleted = wardrobe_service.delete_clothing(
        db, clothing_id, current_user["id"])
    if not deleted:
        raise HTTPException(status_code=404, detail="Vêtement introuvable")
