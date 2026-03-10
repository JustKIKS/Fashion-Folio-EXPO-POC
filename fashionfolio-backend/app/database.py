import sqlite3
import os

DB_PATH = "fashionfolio.db"
SCHEMA_PATH = "schema.sql"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    if not os.path.exists(SCHEMA_PATH):
        raise FileNotFoundError(f"Le fichier {SCHEMA_PATH} est introuvable.")

    conn = get_connection()
    with open(SCHEMA_PATH, "r") as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()
    print("✅ Base de données initialisée avec succès.")


def get_db():
    """Générateur FastAPI — ouvre et ferme automatiquement la connexion."""
    conn = get_connection()
    try:
        yield conn      # FastAPI injecte conn dans la route
    finally:
        conn.close()    # toujours fermé, même si une erreur survient
