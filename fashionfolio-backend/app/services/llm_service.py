from google import genai
import json
from app.config import settings
import base64
from google.genai.errors import APIError


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

    # 1ère partie : Le prompt avec les variables (f-string)
    intro = f"""
Tu es Stylist, l'assistant styliste de FashionFolio.
Tu composes des tenues UNIQUEMENT avec les vêtements du dressing ci-dessous.
Tu réponds UNIQUEMENT en JSON valide, sans texte autour, sans markdown.
Tu as une MÉMOIRE COMPLÈTE de cette conversation — tu te souviens de tout ce qui a été dit.

DRESSING DE L'UTILISATEUR :
{json.dumps(wardrobe, ensure_ascii=False, indent=2)}

HISTORIQUE COMPLET DE CETTE CONVERSATION :
{history_text}

RÈGLES STRICTES :
- Sois très bref et direct dans ton "message" (1 ou 2 phrases max, style fun et mode).
- Tu te souviens de toutes les tenues que tu as déjà proposées dans cet historique.
- Utilise uniquement les vêtements du dressing ci-dessus.
- Présente toujours dans l'ordre : top → bottom → shoes → accessory.

FORMAT DE RÉPONSE OBLIGATOIRE :
"""

    # 2ème partie : Le JSON en chaîne normale (sans le 'f' devant, donc Python ne cherche pas de variables)
    json_format = """{
  "message": "Phrase courte et stylée pour présenter la tenue",
  "outfit": {
    "top":       {"id": 1, "name": "T-shirt blanc", "photo_url": "http://..."},
    "bottom":    {"id": 2, "name": "Jean bleu", "photo_url": "http://..."},
    "shoes":     {"id": 3, "name": "Baskets", "photo_url": "http://..."},
    "accessory": null
  },
  "out_of_scope": false
}"""

    # On colle les deux ensemble !
    return intro + json_format


def get_outfit_suggestion(wardrobe: list, outfit_history: list, user_message: str) -> dict:
    prompt = build_system_prompt(wardrobe, outfit_history)
    full_prompt = prompt + f"\n\nDEMANDE UTILISATEUR : {user_message}"

    try:
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

    # 🚨 FIX : On attrape spécifiquement les erreurs de l'API Google
    except APIError as e:
        print(f"Erreur API Gemini: {e}")
        # On renvoie un JSON "de secours" formaté correctement
        return {
            "message": "Styliste indisponible pour le moment (serveurs surchargés). Veuillez réessayer dans quelques minutes ! ⏳",
            "outfit": None,
            "out_of_scope": False
        }
    except Exception as e:
        print(f"Erreur inattendue Gemini: {e}")
        return {
            "message": "Oups, j'ai eu un petit bug en analysant ton dressing. Peux-tu reformuler ?",
            "outfit": None,
            "out_of_scope": False
        }


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
