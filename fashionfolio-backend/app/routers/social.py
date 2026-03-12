from fastapi import APIRouter, Depends, HTTPException
from app.auth_utils import get_current_user
from app.database import get_db
from app.services.social_service import (
    send_friend_request,
    accept_friend_request,
    get_friends,
    get_friends_outfits,
    get_pending_requests,
    publish_outfit
)
 
# On crée le router avec le préfixe /social
# Toutes les routes de ce fichier commenceront par /social
router = APIRouter(prefix="/social", tags=["Social"])
 
 
@router.post("/friend/request/{receiver_id}")
def add_friend(receiver_id: int, db=Depends(get_db), current_user=Depends(get_current_user)):
    """
    Envoie une demande d'ami à un utilisateur.
    L'id de l'utilisateur cible est dans l'URL : /social/friend/request/2
    """
    try:
        # db est injecté automatiquement par FastAPI via Depends(get_db)
        return send_friend_request(db, current_user["id"], receiver_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
 
 
@router.put("/friends/accept/{friendship_id}")
def accept_friend(friendship_id: int, db=Depends(get_db), current_user=Depends(get_current_user)):
    """
    Accepte une demande d'ami.
    L'id de la demande est dans l'URL : /social/friends/accept/1
    """
    try:
        return accept_friend_request(db, friendship_id, current_user["id"])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
 
 
@router.get("/friends")
def list_friends(db=Depends(get_db), current_user=Depends(get_current_user)):
    """
    Retourne la liste des amis de l'utilisateur connecté.
    """
    # On passe db et l'id de l'utilisateur connecté au service
    return get_friends(db, current_user["id"])
 
 
@router.get("/friends/outfits")
def list_friends_outfits(db=Depends(get_db), current_user=Depends(get_current_user)):
    """
    Retourne les tenues publiées des amis de l'utilisateur connecté.
    C'est le fil d'actualité social de l'app.
    """
    return get_friends_outfits(db, current_user["id"])
 
 
@router.get("/friends/pending")
def list_pending_requests(db=Depends(get_db), current_user=Depends(get_current_user)):
    """
    Retourne les demandes d'ami en attente reçues par l'utilisateur connecté.
    """
    return get_pending_requests(db, current_user["id"])
 
 
@router.post("/outfits/{outfit_id}/publish")
def publish(outfit_id: int, db=Depends(get_db), current_user=Depends(get_current_user)):
    """
    Publie une tenue pour la partager avec ses amis.
    L'id de la tenue est dans l'URL : /social/outfits/1/publish
    """
    try:
        return publish_outfit(db, outfit_id, current_user["id"])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))