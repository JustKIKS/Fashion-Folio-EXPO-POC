import google.generativeai as genai
import json
from app.config import settings

# Configure le client Gemini
genai.configure(api_key=settings.gemini_api_key)
model = genai.GenerativeModel(settings.gemini_model)


def build_system_prompt(wardrobe: list, outfit_history: list) -> str:
    return f"""
Tu es un assistant styliste pour l'application FashionFolio.
Tu composes des tenues UNIQUEMENT avec les vêtements du dressing ci-dessous.
Tu réponds UNIQUEMENT en JSON valide, sans texte autour, sans markdown.

DRESSING DE L'UTILISATEUR :
{json.dumps(wardrobe, ensure_ascii=False, indent=2)}

TENUES DÉJÀ SUGGÉRÉES (ne pas répéter) :
{json.dumps(outfit_history, ensure_ascii=False, indent=2)}

RÈGLES STRICTES :
- Utilise uniquement les vêtements du dressing ci-dessus
- Ne répète jamais une tenue déjà suggérée
- Si la question n'est pas liée à la mode, réponds avec out_of_scope: true
- Présente toujours dans l'ordre : top → bottom → shoes → accessory

FORMAT DE RÉPONSE OBLIGATOIRE :
{{
  "message": "texte naturel pour l'utilisateur",
  "outfit": {{
    "top":       {{"id": 1, "name": "..."}},
    "bottom":    {{"id": 2, "name": "..."}},
    "shoes":     {{"id": 3, "name": "..."}},
    "accessory": null
  }},
  "out_of_scope": false
}}
"""


def get_outfit_suggestion(wardrobe: list, outfit_history: list, user_message: str) -> dict:
    prompt = build_system_prompt(wardrobe, outfit_history)

    # On envoie system prompt + message utilisateur ensemble
    full_prompt = prompt + f"\n\nDEMANDE UTILISATEUR : {user_message}"

    response = model.generate_content(full_prompt)

    # Nettoie la réponse (enlève ```json si présent)
    raw = response.text.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()

    return json.loads(raw)
