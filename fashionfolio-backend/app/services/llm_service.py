from google import genai
import json
from app.config import settings
import base64


client = genai.Client(api_key=settings.GEMINI_API_KEY)


def build_system_prompt(wardrobe: list, outfit_history: list) -> str:

    # Formate l'historique pour le LLM
    history_text = ""
    if outfit_history:
        history_text = "\n".join([
            f"- {msg['role'].upper()} : {msg['content']}"
            for msg in outfit_history
        ])
    else:
        history_text = "Aucune tenue suggérée pour l'instant."

    return f"""
Tu es Stylist, l'assistant styliste de FashionFolio.
Tu composes des tenues UNIQUEMENT avec les vêtements du dressing ci-dessous.
Tu réponds UNIQUEMENT en JSON valide, sans texte autour, sans markdown.
Tu as une MÉMOIRE COMPLÈTE de cette conversation — tu te souviens de tout ce qui a été dit.

DRESSING DE L'UTILISATEUR :
{json.dumps(wardrobe, ensure_ascii=False, indent=2)}

HISTORIQUE COMPLET DE CETTE CONVERSATION :
{history_text}

RÈGLES STRICTES :
- Tu te souviens de toutes les tenues que tu as déjà proposées dans cet historique
- Ne répète jamais une combinaison de vêtements déjà suggérée
- Utilise uniquement les vêtements du dressing ci-dessus
- Les questions sur l'historique ou les tenues passées sont dans ton périmètre — réponds-y
- Si et SEULEMENT SI la question n'a aucun rapport avec la mode ou les vêtements, mets out_of_scope: true
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

Si l'utilisateur pose une question sur les tenues passées (ex: "tu te souviens ?"), 
réponds avec out_of_scope: false et résume les tenues de l'historique dans "message", 
avec "outfit": null.
"""


def get_outfit_suggestion(wardrobe: list, outfit_history: list, user_message: str) -> dict:
    prompt = build_system_prompt(wardrobe, outfit_history)
    full_prompt = prompt + f"\n\nDEMANDE UTILISATEUR : {user_message}"

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=full_prompt
    )

    print("=== RÉPONSE GEMINI ===")
    print(response.text)
    print("=====================")

    raw = response.text.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()

    return json.loads(raw)


def analyze_clothing_photo(image_bytes: bytes) -> dict:

    # Encode l'image en base64
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    prompt = """
Analyse ce vêtement et retourne UNIQUEMENT un JSON valide sans texte autour.

FORMAT OBLIGATOIRE :
{
  "type": "haut | bas | robe | chaussures | accessoire | sac",
  "color": "couleur principale en français",
  "style": "casual | formel | sportswear | soirée",
  "pattern": "uni | rayé | floral | carreaux | autre",
  "brand": "marque si visible sinon null",
  "season": "été | hiver | mi-saison | all-season"
}
"""

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=[
            {"role": "user", "parts": [
                {"inline_data": {"mime_type": "image/jpeg", "data": image_b64}},
                {"text": prompt}
            ]}
        ]
    )

    raw = response.text.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()

    return json.loads(raw)
