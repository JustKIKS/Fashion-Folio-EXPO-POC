from app.database import get_db

def send_friend_request(requester_id: int, receiver_id: int):
    """
    Envoie une demande d'ami entre deux utilisateurs.
    Insère une ligne dans friendships avec status = 'pending'.
    """

# On ne peut pas s'envoyer une demande à soi-même
    if requester_id == receiver_id:
        raise ValueError("Vous ne pouvez pas vous ajouter vous-même.")

    db = get_db()

    # Vérifie si une demande existe déjà entre ces deux utilisateurs
    existing = db.execute(
        "SELECT * FROM friendships WHERE requester_id = ? AND receiver_id = ?",
        (requester_id, receiver_id)
    ).fetchone()

    if existing:
        raise ValueError("Une demande d'ami existe déjà.")
    
    # Insère la demande d'ami avec le status 'pending'
    db.execute(
        "INSERT INTO friendships (requester_id, receiver_id, status) VALUES (?, ?, 'pending')",
        (requester_id, receiver_id)
    )

    db.commit()
    db.close()

    return {"message": "Demande d'ami envoyée avec succès."}

