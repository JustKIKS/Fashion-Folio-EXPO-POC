from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import sqlite3
import os
import aiofiles
import uuid

from app.database import get_db, get_connection
from app.auth_utils import get_current_user
from app.schemas.clothing import ClothingCreate, ClothingUpdate, ClothingOut
from app.services import wardrobe_service
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
async def upload_photo(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    image_bytes = await file.read()

    # Analyse via Gemini Vision
    attributes = analyze_clothing_photo(image_bytes)

    # 🚨 FIX : Création automatique du dossier s'il n'existe pas
    upload_dir = "uploads/clothing"
    os.makedirs(upload_dir, exist_ok=True)

    # Sauvegarde l'image en local avec un nom unique
    extension = file.filename.split(".")[-1]
    filename = f"user_{user_id}_{os.urandom(4).hex()}.{extension}"
    filepath = os.path.join(upload_dir, filename)

    async with aiofiles.open(filepath, "wb") as f:
        await f.write(image_bytes)

    # ⚠️ ATTENTION : Change l'IP par celle de ta box (192.168...)
    # pour que ton téléphone puisse charger l'image !
    current_ip = "192.168.1.188"  # Ton IP actuelle chez toi
    photo_url = f"http://{current_ip}:8000/uploads/clothing/{filename}"

    # Insère en DB avec les attributs trouvés par l'IA
    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO clothing (user_id, type, color, style, pattern, brand, season, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (
            user_id,
            attributes.get("type"),
            attributes.get("color"),
            attributes.get("style"),
            attributes.get("pattern"),
            attributes.get("brand"),
            attributes.get("season"),
            photo_url
        )
    )
    conn.commit()
    conn.close()

    return {
        "message": "Vêtement analysé et ajouté ✅",
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
