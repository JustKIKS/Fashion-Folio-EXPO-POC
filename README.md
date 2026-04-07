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
=======
# Groupe de brouar_l 1075096



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

* [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
* [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://rendu-git.etna-alternance.net/module-10143/activity-55374/group-1075096.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

* [Set up project integrations](https://rendu-git.etna-alternance.net/module-10143/activity-55374/group-1075096/-/settings/integrations)

## Collaborate with your team

* [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
* [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
* [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
* [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
* [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

* [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
* [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
* [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
* [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
* [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
>>>>>>> 717b73bb092dabcc9d16e5798aba6dc03c56d868
