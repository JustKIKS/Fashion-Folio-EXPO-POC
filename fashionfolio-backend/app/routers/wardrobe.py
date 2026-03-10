
from fastapi import APIRouter, Depends, HTTPException
import sqlite3

from app.database import get_db
from app.auth_utils import get_current_user
from app.schemas.clothing import ClothingCreate, ClothingUpdate, ClothingOut
from app.services import wardrobe_service

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
