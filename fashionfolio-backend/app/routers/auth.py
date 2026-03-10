from fastapi import APIRouter, Depends, HTTPException, status
import sqlite3

from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserOut, Token
from app.auth_utils import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=201)
def register(payload: UserCreate, db: sqlite3.Connection = Depends(get_db)):
    # Vérifie si l'email ou le username est déjà pris
    existing = db.execute(
        "SELECT id FROM users WHERE email = ? OR username = ?",
        (payload.email, payload.username),
    ).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Email ou username déjà utilisé")

    hashed = hash_password(payload.password)
    cursor = db.execute(
        "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
        (payload.email, payload.username, hashed),
    )
    db.commit()

    row = db.execute("SELECT * FROM users WHERE id = ?", (cursor.lastrowid,)).fetchone()
    return dict(row)


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: sqlite3.Connection = Depends(get_db)):
    row = db.execute("SELECT * FROM users WHERE email = ?", (payload.email,)).fetchone()
    if not row or not verify_password(payload.password, row["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
        )

    token = create_access_token(row["id"])
    return {"access_token": token, "token_type": "bearer"}
