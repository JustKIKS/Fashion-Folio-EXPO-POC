from fastapi import FastAPI
from app.database import init_db
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, wardrobe, chat, social
from fastapi.staticfiles import StaticFiles


app = FastAPI(
    title="👔 FashionFolio API 🚀",
    description="Backend du POC FashionFolio — dressing digital, recommandations IA et espace social",
    version="0.1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise ton téléphone à se connecter
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],  # Autorise tous les headers
)


@app.on_event("startup")
def startup():
    """Fonction exécutée automatiquement au démarrage de l'app."""
    init_db()


app.include_router(auth.router)
app.include_router(wardrobe.router)
app.include_router(chat.router)
app.include_router(social.router)


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
def root():
    return {"message": "FashionFolio API is running 🚀"}
