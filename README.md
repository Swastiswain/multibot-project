# 🤖 Multi-Bot Chatbot

A full-stack chatbot application with multiple specialized AI bots, built with **FastAPI** (backend) and **React + Vite** (frontend).

## Bots Available

| Bot | Description |
|-----|-------------|
| 😄 **Joke Bot** | Tells jokes and puns |
| ✦ **Quote Bot** | Shares inspirational quotes |
| 📖 **Dictionary Bot** | Defines words with examples |
| 💱 **Currency Bot** | Converts between currencies |

---

## Project Structure

```
multibot-project/
├── backend/               # FastAPI backend
│   ├── main.py            # App entrypoint + all routes
│   ├── bots.py            # Intent classifier + Groq AI responses
│   ├── database.py        # SQLite session & message storage
│   ├── requirements.txt   # Python dependencies
│   ├── .env.example       # Environment variable template
│   └── .gitignore
│
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── App.module.css # Component styles
│   │   ├── bots.js        # Bot config + static responses
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles + CSS variables
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
├── .gitignore             # Root-level ignores
└── README.md
```

---

## Getting Started

### Backend

```bash
cd backend

# 1. Create virtual environment
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# 4. Run the server
uvicorn main:app --reload
# → http://localhost:8000
```

### Frontend

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
# → http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/bots` | List all bots |
| `POST` | `/chat` | Send a message |
| `POST` | `/session` | Create a new session |
| `GET` | `/sessions/{bot_id}` | List sessions for a bot |
| `GET` | `/history/{session_id}` | Get chat history |
| `DELETE` | `/session/{session_id}` | Delete a session |

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | ✅ Yes | — | API key from [console.groq.com](https://console.groq.com) |
| `ALLOWED_ORIGINS` | No | `http://localhost:5173,http://localhost:3000` | Comma-separated CORS origins |

---

## Deployment (Render)

**Backend:**
- Service type: Web Service
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add `GROQ_API_KEY` and `ALLOWED_ORIGINS` as environment variables

**Frontend:**
- Service type: Static Site
- Build command: `npm install && npm run build`
- Publish directory: `dist`

---

## Tech Stack

- **Backend:** FastAPI · Uvicorn · SQLite · Groq (LLaMA 3)
- **Frontend:** React 18 · Vite · CSS Modules
