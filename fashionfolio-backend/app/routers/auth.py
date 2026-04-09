from fastapi import APIRouter, Depends, HTTPException, status
import sqlite3

from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserOut, Token

# 🚨 CORRECTION : On importe directement get_current_user depuis ton auth_utils !
from app.auth_utils import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=201)
def register(payload: UserCreate, db: sqlite3.Connection = Depends(get_db)):
    existing = db.execute(
        "SELECT id FROM users WHERE email = ? OR username = ?",
        (payload.email, payload.username),
    ).fetchone()
    if existing:
        raise HTTPException(
            status_code=400, detail="Email ou username déjà utilisé")

    hashed = hash_password(payload.password)
    cursor = db.execute(
        "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
        (payload.email, payload.username, hashed),
    )
    db.commit()

    row = db.execute("SELECT * FROM users WHERE id = ?",
                     (cursor.lastrowid,)).fetchone()
    return dict(row)


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: sqlite3.Connection = Depends(get_db)):
    row = db.execute("SELECT * FROM users WHERE email = ?",
                     (payload.email,)).fetchone()
    if not row or not verify_password(payload.password, row["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
        )

    token = create_access_token(row["id"])
    return {"access_token": token, "token_type": "bearer"}


# 🎯 LA ROUTE /me EST MAINTENANT TOUTE SIMPLE !
@router.get("/me")
def get_my_profile(current_user: dict = Depends(get_current_user)):
    return {
        "username": current_user["username"],
        "email": current_user["email"],
        "full_name": current_user["username"]
    }
