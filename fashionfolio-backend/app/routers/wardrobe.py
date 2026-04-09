from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import sqlite3
import os
import aiofiles

from app.database import get_db, get_connection
from app.auth_utils import get_current_user
from app.schemas.clothing import ClothingCreate, ClothingUpdate, ClothingOut
from app.services import wardrobe_service
from app.services.llm_service import analyze_clothing_photo

router = APIRouter(prefix="/wardrobe", tags=["wardrobe"])


@router.get("/", response_model=list[ClothingOut])
def list_wardrobe(
    db: sqlite3.Connection = Depends(get_db),
    # 🚨 CORRECTION 1 : On décommente cette ligne pour lire le token
    current_user: dict = Depends(get_current_user),
):
    # 🚨 CORRECTION 2 : On remplace le "1" par le vrai ID du propriétaire du token
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
async def upload_photo(
    file: UploadFile = File(...),
    # 🚨 CORRECTION 3 : L'upload photo est maintenant sécurisé par le token lui aussi !
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    image_bytes = await file.read()
    attributes = analyze_clothing_photo(image_bytes)

    # Sauvegarde l'image en local
    extension = file.filename.split(".")[-1]
    filename = f"user_{user_id}_{os.urandom(4).hex()}.{extension}"
    filepath = f"uploads/clothing/{filename}"

    async with aiofiles.open(filepath, "wb") as f:
        await f.write(image_bytes)

    # Assure-toi de mettre la bonne IP ici si tu testes sur mobile (ex: http://10.1.219.54:8000)
    photo_url = f"http://10.1.219.54:8000/uploads/clothing/{filename}"

    # Insère en DB avec la photo_url
    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO clothing (user_id, type, color, style, pattern, brand, season, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (user_id, attributes.get("type"), attributes.get("color"), attributes.get("style"),
         attributes.get("pattern"), attributes.get("brand"), attributes.get("season"), photo_url)
    )
    conn.commit()
    conn.close()

    return {
        "message": "Vêtement ajouté automatiquement ✅",
        "id": cursor.lastrowid,
        "photo_url": photo_url,
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
