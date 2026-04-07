<<<<<<< HEAD
# 👔 FashionFolio - Backend API

<p>
  <img src="./fashionfolio-backend/imgMD/Full%20logo%20(for%20clear%20background).png" alt="FashionFolio" width="550"/>
</p>

---

Backend du POC **FashionFolio**, une application mobile dédiée à la mode et au style, propulsée par l'intelligence artificielle.

---

## 📋 Présentation

FashionFolio repose sur trois piliers :

1. **Le dressing digital** - chaque utilisateur centralise sa garde-robe avec des attributs par vêtement (type, couleur, style, motif, marque…)
2. **La recommandation de tenues par IA** - un LLM génère des suggestions de tenues cohérentes à partir du dressing de l'utilisateur, via une interface conversationnelle
3. **Un espace social** - partage de tenues entre amis, visibilité restreinte au cercle proche

---

## 🛠️ Stack technique

| Technologie       | Rôle                             |
| ----------------- | -------------------------------- |
| **Python 3.12**   | Langage principal                |
| **FastAPI**       | Framework API REST               |
| **SQLite**        | Base de données                  |
| **Pydantic**      | Validation des données           |
| **Google Gemini** | LLM pour la génération de tenues |
| **JWT**           | Authentification                 |
| **Uvicorn**       | Serveur ASGI                     |

---

## 🗄️ Modèle de données

- **users** - comptes utilisateurs
- **clothing** - vêtements du dressing (type, couleur, style, motif, marque, saison)
- **conversations** - historique des échanges avec l'IA (mémoire JSON)
- **outfits** - tenues générées par l'IA, publiables sur l'espace social
- **outfit_items** - liaison entre une tenue et ses vêtements
- **friendships** - relations d'amitié entre utilisateurs (pending / accepted)

---

## 🚀 Installation et lancement

### 1. Cloner le projet

```bash
git clone git@rendu-git.etna-alternance.net:module-10142/activity-54939/group-1071817.git
cd fashionfolio-backend
```

### 2. Créer et activer l'environnement virtuel

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 4. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Remplir le fichier `.env` :

```
DATABASE_URL=sqlite:///fashionfolio.db
JWT_SECRET=ton-secret-jwt
GEMINI_API_KEY=ta-clé-gemini
GEMINI_MODEL=gemini-2.5-flash
```

### 5. Lancer l'application

```bash
uvicorn app.main:app --reload
```

L'API est accessible sur `http://localhost:8000`
La documentation Swagger est accessible sur `http://localhost:8000/docs`

---

## 📡 Endpoints principaux

### 🔐 Authentification

| Méthode | Route            | Description                          |
| ------- | ---------------- | ------------------------------------ |
| POST    | `/auth/register` | Créer un compte                      |
| POST    | `/auth/login`    | Se connecter et obtenir un token JWT |

### 👗 Dressing

| Méthode | Route            | Description           |
| ------- | ---------------- | --------------------- |
| GET     | `/wardrobe/`     | Lister ses vêtements  |
| POST    | `/wardrobe/`     | Ajouter un vêtement   |
| PUT     | `/wardrobe/{id}` | Modifier un vêtement  |
| DELETE  | `/wardrobe/{id}` | Supprimer un vêtement |

### 🤖 Chat IA

| Méthode | Route    | Description                                            |
| ------- | -------- | ------------------------------------------------------ |
| POST    | `/chat/` | Envoyer un message et recevoir une suggestion de tenue |

### 👥 Social

| Méthode | Route                          | Description                          |
| ------- | ------------------------------ | ------------------------------------ |
| POST    | `/social/friend/request/{id}`  | Envoyer une demande d'ami            |
| PUT     | `/social/friends/accept/{id}`  | Accepter une demande d'ami           |
| GET     | `/social/friends`              | Lister ses amis                      |
| GET     | `/social/friends/pending`      | Voir les demandes en attente         |
| GET     | `/social/friends/outfits`      | Voir les tenues publiées de ses amis |
| POST    | `/social/outfits/{id}/publish` | Publier une tenue                    |

---

## 🤖 Périmètre IA

**Ce que l'IA fait :**

- Génère des tenues simples, cohérentes et esthétiques
- S'appuie uniquement sur le dressing de l'utilisateur
- Répond via une interface conversationnelle
- Évite les répétitions de tenues grâce à la mémoire
- Présente les vêtements dans l'ordre logique (haut → bas → chaussures → accessoires)

**Ce que l'IA ne fait pas :**

- Proposer des vêtements inexistants dans le dressing
- Répondre à des questions hors périmètre mode
- Se comporter comme un chatbot généraliste

---
