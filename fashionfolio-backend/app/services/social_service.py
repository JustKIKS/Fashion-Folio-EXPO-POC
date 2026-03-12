def send_friend_request(db, requester_id: int, receiver_id: int):
    """
    Envoie une demande d'ami entre deux utilisateurs.
    Insère une ligne dans friendships avec status = 'pending'.
    """
 
    # On ne peut pas s'envoyer une demande à soi-même
    if requester_id == receiver_id:
        raise ValueError("Vous ne pouvez pas vous ajouter vous-même.")
 
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
 
    return {"message": "Demande d'ami envoyée avec succès."}
 
 
def accept_friend_request(db, friendship_id: int, user_id: int):
    """
    Accepte une demande d'ami.
    Seul le receiver peut accepter la demande.
    Met à jour le status en 'accepted'.
    """
 
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
 
    return {"message": "Demande d'ami acceptée."}
 
 
def get_friends(db, user_id: int):
    """
    Retourne la liste des amis acceptés d'un utilisateur.
    On cherche les relations où l'user est soit requester soit receiver.
    """
 
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
 
    # Convertit les résultats en liste de dictionnaires
    return [dict(friend) for friend in friends]
 
 
def get_friends_outfits(db, user_id: int):
    """
    Retourne les tenues publiées (is_published = 1) des amis d'un utilisateur.
    Utilisé pour l'espace social.
    """
 
    # Récupère les tenues publiées des amis — l'user peut être des deux côtés de la relation
    outfits = db.execute(
        """
        SELECT o.id, o.user_id, o.description, o.created_at, u.username
        FROM outfits o
        JOIN users u ON o.user_id = u.id
        JOIN friendships f ON (
            (f.requester_id = ? AND f.receiver_id = o.user_id)
            OR
            (f.receiver_id = ? AND f.requester_id = o.user_id)
        )
        WHERE o.is_published = 1
        AND f.status = 'accepted'
        ORDER BY o.created_at DESC
        """,
        (user_id, user_id)
    ).fetchall()
 
    # Convertit les résultats en liste de dictionnaires
    return [dict(outfit) for outfit in outfits]
 
 
def get_pending_requests(db, user_id: int):
    """
    Retourne les demandes d'ami en attente reçues par un utilisateur.
    """
 
    # Récupère les demandes en attente où l'user est le receiver
    requests = db.execute(
        """
        SELECT f.id, f.requester_id, f.created_at, u.username, u.avatar_url
        FROM friendships f
        JOIN users u ON f.requester_id = u.id
        WHERE f.receiver_id = ? AND f.status = 'pending'
        ORDER BY f.created_at DESC
        """,
        (user_id,)
    ).fetchall()
 
    return [dict(request) for request in requests]
 
 
def publish_outfit(db, outfit_id: int, user_id: int):
    """
    Publie une tenue pour la partager avec ses amis.
    Seul le propriétaire de la tenue peut la publier.
    Met à jour is_published = 1 dans la table outfits.
    """
 
    # Vérifie que la tenue appartient bien à l'utilisateur connecté
    outfit = db.execute(
        "SELECT * FROM outfits WHERE id = ? AND user_id = ?",
        (outfit_id, user_id)
    ).fetchone()
 
    if not outfit:
        raise ValueError("Tenue introuvable ou vous n'êtes pas le propriétaire.")
 
    # Met à jour is_published à 1 pour rendre la tenue visible aux amis
    db.execute(
        "UPDATE outfits SET is_published = 1 WHERE id = ?",
        (outfit_id,)
    )
    db.commit()
 
    return {"message": "Tenue publiée avec succès."}