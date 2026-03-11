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

def accept_friend_request(friendship_id: int, user_id: int):
    """
    Accepte une demande d'ami.
    Seul le receiver peut accepter la demande.
    Met à jour le status en 'accepted'.
    """
    db = get_db()

    # Vérifie que la demande existe et que c'est bien le receiver qui accepte
    friendship = db.execute(
        "SELECT * FROM friendships WHERE id = ? AND receiver_id = ? AND status = 'pending'",
        (friendship_id, user_id)
    ).fetchone()

    if not friendship:
        raise ValueError("Demande d'ami introuvable ou déjà traitée.")
    
    # Met à jour le status en 'accepted'
    db.execute(
        "UPDATE friendships SET status = 'accepted' WHERE id = ?",
        (friendship_id,)
    )

    db.commit()
    db.close()

    return {"message": "Demande d'ami acceptée."}

def get_friends(user_id: int):
    """
    Retourne la liste des amis acceptés d'un utilisateur.
    On cherche les relations où l'user est soit requester soit receiver.
    """

    db = get_db()

    # On récupère tous les amis acceptés — l'user peut être des deux côtés de la relation
    friends = db.execute(
        """
        SELECT u.id, u.username, u.email, u.avatar_url
        FROM users u
        JOIN friendships f ON (
            (f.requester_id = ? AND f.receiver_id = u.id)
            OR
            (f.receiver_id = ? AND f.requester_id = u.id)
        )
        WHERE f.status = 'accepted'
        """,
        (user_id, user_id)
    ).fetchall()

    db.close()

    # Convertit les résultats en liste de dictionnaires
    return [dict(friend) for friend in friends]

def get_friends_outfits(user_id: int):
    """
    Retourne les tenues publiées (is_published = 1) des amis d'un utilisateur.
    Utilisé pour l'espace social.
    """

    db = get_db()

    # Récupère les tenues publiées des amis - l'user peut être des 2 cotés de la relation
    outfits = db.execute(
        """
        SELECT o.id o.user_id, o.description, o.created_at, u.username
        FROM outfits o
        JOIN users u ON o.user_id = u.id
        JOIN friendship f ON (
            (f.requester_id = ? AND f.receiver_id = o.user_id)
            OR
            (f.receiver_id = ?  AND f.requester_id = o.user_id)
        )
        WHERE o.is_puvlished = 1
        AND f.status = 'accepted'
        ORDER BY o.created_at DESC
        """,
        (user_id, user_id)
    ).fetchall()

    db.close()

    # Convertit les résultats en liste de dictionnaires
    return [dict(outfit) for outfit in outfits]