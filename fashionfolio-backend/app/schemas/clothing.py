from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ClothingCreate
# Utilisé quand l'utilisateur AJOUTE un vêtement dans son dressing
# Ces champs sont ce que l'app mobile enverra à l'API
class ClothingCreate(BaseModel):
    # Champs obligatoires — le LLM en a besoin pour composer une tenue
    type: str  # 'haut' | 'bas' | 'chaussures' | 'accessoire'
    color: str  # ex: 'bleu marine', 'blanc cassé'
    style: str # 'casual' | 'formel' | 'sportswear' | 'soirée'

    # Champs optionnels — utiles mais pas indispensables
    pattern: Optional[str] = None # 'uni' | 'rayé' | 'floral' | 'carreaux'
    brand: Optional[str] = None # ex: 'Zara', 'Nike', 'Sandro'
    season: Optional[str] = None  # 'été' | 'hiver' | 'mi-saison' | 'all-season'
    photo_url: Optional[str] = None # (bonus) lien vers la photo du vêtement

# ClothingUpdate
# Utilisé quand l'utilisateur MODIFIE un vêtement existant
# Tous les champs sont optionnels — on modifie uniquement ce qu'on veut
class ClothingUpdate(BaseModel):
    type: Optional[str] = None
    color: Optional[str] = None
    style: Optional[str] = None
    pattern: Optional[str] = None
    brand: Optional[str] = None
    season: Optional[str] = None
    photo_url: Optional[str] = None

# ClothingResponse
# Utilisé quand l'API RETOURNE un vêtement à l'app mobile
# Contient tous les champs de ClothingCreate + les champs générés par la DB
class ClothingResponse(BaseModel):
    id: int  # généré automatiquement par la DB
    user_id: int  # l'utilisateur à qui appartient le vêtement
    type: str
    color: str
    style: str
    pattern: Optional[str] = None
    brand: Optional[str] = None
    season: Optional[str] = None
    photo_url: Optional[str] = None 
    created_at: datetime # généré automatiquement par la DB
