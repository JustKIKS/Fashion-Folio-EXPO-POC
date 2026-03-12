from fastapi import APIRouter, Depends, HTTPException
from app.auth_utils import get_current_user
from app.services.social_service import(
    send_friend_request,
    accept_friend_request,
    get_friends,
    get_friends_outfits, 
    get_pending_requests,
    publish_outfit
)

# On crée le router avec le préfixe/social
# Toutes les routes de ce fichier commenceront par /social
router = APIRouter(prefix="/social", tags=["Social"])

@router.post("/friend/request/{receiver_id}")
def add_friend(receiver_id: int, current_user=Depends(get_current_user)):
    """
    Envoie une demande d'ami à un utilisateur.
    L'id de l'utilisateur cible est dans l'URL : /social/friends/request/2
    """

    try: 
        # On appelle le service avec l'id de l'utilisateur connecté et l'id du destinatire
        return send_friend_request(
            requester_id=current_user["id"],
            receiver_id=receiver_id
        )
    except ValueError as e:
        # Si le service lève une erreur (doublon, self-add), on renvoie une ereur
        raise HTTPException(status_code=400, detail=str(e))
    
@router.put("/friends/accept/{friendship_id}")
def accept_friend(friendship_id: int, current_user=Depends(get_current_user)):
    """
    Accepte une demande d'ami.
    L'id de la demande est dans l'URL : /social/friends/accept/1
    """

    try: 
        return accept_friend_request(
            friendship_id=friendship_id,
            user_id=current_user["id"]
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/friends")
def list_friends(current_user=Depends(get_current_user)):
    """
    Retorune la liste des amis de l'utilisateur connecté
    """

    # On passe juste l'id de l'utilisateur connecté au service
    return get_friends(user_id=current_user["id"])

@router.get("/friends/outfits")
def list_friends_outfits(current_user=Depends(get_current_user)):
    """
    Retourne les tenues publiées des amis de l'utilisateur connecté.
    C'est le fil d'actualité social de l'app.
    """
    return get_friends_outfits(user_id=current_user["id"])

@router.get("/friends/pending")
def list_pending_requests(current_user=Depends(get_current_user)):
    """
    Retourne les demandes d'ami en attente reçues par l'utilisateur connecté.
    """
    return get_pending_requests(user_id=current_user["id"])

@router.post("/outfits/{outfit_id}/publish")
def publish(outfit_id: int, current_user=Depends(get_current_user)):
    """
    Publie une tenue pour la partager avec ses amis.
    L'id de la tenue est dans l'URL : /social/outfits/1/publish
    """

    try:
        return publish_outfit(
            outfit_id=outfit_id,
            user_id=current_user["id"]
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))