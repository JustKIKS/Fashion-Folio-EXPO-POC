from fastapi import APIRouter, Depends, HTTPException
from app.auth_utils import get_current_user
from app.services.social_service import(
    send_friend_request,
    accept_friend_request,
    get_friends,
    get_friends_outfits, 
    ge_pending_request
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
        raise HTTPException(status_code=400, details=str(e))