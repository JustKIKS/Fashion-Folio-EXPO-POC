from fastapi import FastAPI
from app.database import init_db
from app.routers import auth, wardrobe, chat


# Création de l'application FastAPI
# title, description et version apparaissent dans la doc automatique de FastAPI (http://localhost:8000/docs)
app = FastAPI(
    title="FashionFolio API",
    description="Backend du POC FashionFolio — dressing digital, recommandations IA et espace social",
    version="0.1.0"
)

# Ce décorateur dit à FastAPI : "exécute cette fonction automatiquement au démarrage de l'app"
@app.on_event("startup")
def startup():
    """Fonction exécutée automatiquement au démarrage de l'app."""
    # On initialise la base de données
    # Si les tables n'existent pas encore, elles sont créées à partir du schema.sql
    init_db()

app.include_router(auth.router)
app.include_router(wardrobe.router)
app.include_router(chat.router)

# Route de base — permet de vérifier rapidement que l'API tourne
# Accessible sur http://localhost:8000/
@app.get("/")
def root():
    return {"message": "FashionFolio API is running 🚀"}
