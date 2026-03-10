-- ============================================================
--  FASHIONFOLIO — Schema SQLite
--  Ordre de création : users → clothing → conversations
--                      → outfits → outfit_items → friendships
-- ============================================================

-- ------------------------------------------------------------
-- 1. USERS
--    Socle de tout : chaque ressource appartient à un user
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT    NOT NULL UNIQUE,
    email         TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    avatar_url    TEXT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. CLOTHING
--    Un vêtement appartient à un user (son dressing)
--    Les attributs sont choisis pour que le LLM puisse
--    composer une tenue cohérente
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clothing (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Attributs descriptifs (exploités par le LLM)
    type       TEXT NOT NULL,   -- 'haut' | 'bas' | 'chaussures' | 'accessoire'
    color      TEXT NOT NULL,   -- ex: 'bleu marine', 'blanc cassé'
    style      TEXT NOT NULL,   -- 'casual' | 'formel' | 'sportswear' | 'soirée'
    pattern    TEXT,            -- 'uni' | 'rayé' | 'floral' | 'carreaux'
    brand      TEXT,            -- ex: 'Zara', 'Nike', 'Sandro'
    season     TEXT,            -- 'été' | 'hiver' | 'mi-saison' | 'all-season'
    photo_url  TEXT,            -- (bonus) photo du vêtement

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 3. CONVERSATIONS
--    Mémoire du chat IA par utilisateur
--    messages = tableau JSON [{role, content}, ...]
--    → permet au LLM de ne pas répéter les tenues déjà suggérées
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    messages   TEXT    NOT NULL DEFAULT '[]',  -- JSON array
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 4. OUTFITS
--    Une tenue générée par le LLM (ou créée manuellement)
--    Peut être publiée sur l'espace social (is_published)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS outfits (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description  TEXT,           -- texte narratif généré par le LLM
    is_published INTEGER DEFAULT 0,  -- 0 = privé | 1 = publié
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 5. OUTFIT_ITEMS
--    Table de liaison entre une tenue et ses vêtements
--    Une tenue = plusieurs vêtements du dressing
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS outfit_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    outfit_id   INTEGER NOT NULL REFERENCES outfits(id)  ON DELETE CASCADE,
    clothing_id INTEGER NOT NULL REFERENCES clothing(id) ON DELETE CASCADE,
    position    INTEGER,  -- ordre d'affichage (1=haut, 2=bas, 3=chaussures, 4=accessoire)

    UNIQUE(outfit_id, clothing_id)  -- pas de doublon dans une même tenue
);

-- ------------------------------------------------------------
-- 6. FRIENDSHIPS
--    Relation entre deux users (bidirectionnelle)
--    status : 'pending' → en attente | 'accepted' → amis
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS friendships (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status       TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'accepted'
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(requester_id, receiver_id)  -- pas de doublon de relation
);

-- ============================================================
--  INDEX — pour accélérer les requêtes fréquentes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_clothing_user     ON clothing(user_id);
CREATE INDEX IF NOT EXISTS idx_outfits_user      ON outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfit_items      ON outfit_items(outfit_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_users  ON friendships(requester_id, receiver_id);