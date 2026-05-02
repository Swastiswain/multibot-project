from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
import time
import os

from bots import classify_intent, get_bot_response
from database import (
    init_db,
    save_message,
    get_history,
    get_sessions,
    create_session,
    delete_session as db_delete,
)

app = FastAPI(title="Multi-Bot Chatbot API")

# ──────────────────────────────────────────
# CORS
# ──────────────────────────────────────────

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────
# STARTUP
# ──────────────────────────────────────────

@app.on_event("startup")
async def startup():
    init_db()

# ──────────────────────────────────────────
# MODELS
# ──────────────────────────────────────────

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str

class NewSessionRequest(BaseModel):
    bot_id: str

# ──────────────────────────────────────────
# CONSTANTS
# ──────────────────────────────────────────

VALID_BOTS = ["joke", "quote", "dict", "currency"]

# ──────────────────────────────────────────
# ROUTES — General
# ──────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "running", "message": "Multi-Bot Chatbot API"}

@app.get("/bots")
def list_bots():
    return {
        "bots": [
            {"id": "joke",     "name": "Joke Bot",       "desc": "Tell me a joke",    "icon": "😄"},
            {"id": "quote",    "name": "Quote Bot",      "desc": "Daily inspiration", "icon": "✦"},
            {"id": "dict",     "name": "Dictionary Bot", "desc": "Word meanings",     "icon": "📖"},
            {"id": "currency", "name": "Currency Bot",   "desc": "FX conversions",    "icon": "💱"},
        ]
    }

# ──────────────────────────────────────────
# ROUTES — Sessions
# ──────────────────────────────────────────

@app.post("/session")
def new_session(req: NewSessionRequest):
    if req.bot_id not in VALID_BOTS:
        raise HTTPException(status_code=400, detail="Invalid bot_id")
    session_id = create_session(req.bot_id)
    return {"session_id": session_id}

@app.get("/sessions/{bot_id}")
def bot_sessions(bot_id: str):
    if bot_id not in VALID_BOTS:
        raise HTTPException(status_code=400, detail="Invalid bot_id")
    return {"bot_id": bot_id, "sessions": get_sessions(bot_id)}

@app.delete("/session/{session_id}")
def delete_session(session_id: str):
    db_delete(session_id)
    return {"status": "deleted", "session_id": session_id}

# ──────────────────────────────────────────
# ROUTES — History
# ──────────────────────────────────────────

@app.get("/history/{session_id}")
def chat_history(session_id: str):
    messages = get_history(session_id)
    if messages is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"session_id": session_id, "messages": messages}

# ──────────────────────────────────────────
# ROUTES — Chat
# ──────────────────────────────────────────

@app.post("/chat")
async def chat(req: ChatRequest):
    start_time = time.time()

    # Classify intent
    intent = classify_intent(req.message)
    if intent not in VALID_BOTS:
        intent = "joke"

    # Resolve / create session
    if req.session_id and get_history(req.session_id) is not None:
        session_id = req.session_id
    else:
        session_id = create_session(intent)

    # Persist user message
    save_message(session_id, "user", req.message)

    # Fetch full history for context
    history = get_history(session_id)

    try:
        response = await get_bot_response(intent, req.message, history)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Persist bot reply
    save_message(session_id, "assistant", response)

    elapsed = round(time.time() - start_time, 2)
    print(f"✅ Done | Intent: {intent} | Time: {elapsed}s")

    return {"session_id": session_id, "intent": intent, "response": response}

# ──────────────────────────────────────────
# ENTRY POINT
# ──────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
