import os
import asyncio
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ──────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────

HISTORY_LIMIT = 6

# ──────────────────────────────────────────
# SYSTEM PROMPTS
# ──────────────────────────────────────────

SYSTEM_PROMPTS = {
    "joke": (
        "You are a witty joke bot. "
        "Respond ONLY with a short, clean joke or pun. "
        "Do not explain."
    ),
    "quote": (
        "You are a quote bot. Respond with ONE short inspirational quote "
        "and its author. Format: \"quote\" — Author."
    ),
    "dict": (
        "You are a dictionary bot. Provide meaning, part of speech, and one example."
    ),
    "currency": (
        "You are a currency conversion bot. Give approximate conversions clearly."
    ),
}

# ──────────────────────────────────────────
# RULE-BASED INTENT CLASSIFIER
# ──────────────────────────────────────────

_RULES = [
    ("dict",     ["define", "meaning"]),
    ("currency", ["usd", "inr", "convert"]),
    ("quote",    ["quote", "motivate", "inspire"]),
    ("joke",     ["joke", "funny"]),
]

def classify_intent(message: str) -> str:
    msg = message.lower()
    for intent, patterns in _RULES:
        if any(p in msg for p in patterns):
            return intent
    return "joke"

# ──────────────────────────────────────────
# HISTORY BUILDER
# ──────────────────────────────────────────

def _build_messages(bot_id: str, message: str, history: list) -> list:
    system_prompt = SYSTEM_PROMPTS.get(bot_id, "You are a helpful assistant.")
    messages = [{"role": "system", "content": system_prompt}]

    for msg in history[-HISTORY_LIMIT:]:
        messages.append({
            "role": msg.get("role"),
            "content": msg.get("content"),
        })

    messages.append({"role": "user", "content": message})
    return messages

# ──────────────────────────────────────────
# MAIN RESPONSE FUNCTION
# ──────────────────────────────────────────

async def get_bot_response(bot_id: str, message: str, history: list) -> str:
    messages = _build_messages(bot_id, message, history)

    try:
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model="llama3-8b-8192",
            messages=messages,
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"❌ Groq error: {e}")
        return "⚠️ Something went wrong. Please try again."
