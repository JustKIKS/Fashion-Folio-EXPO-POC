from app.database import get_db

def send_friend_request(requester_id: int, receiver_id: int):
    """
    Envoie une demande d'ami entre deux utilisateurs.
    Insère une ligne dans friendships avec status = 'pending'.
    """
    