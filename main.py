# main.py (ROOT LEVEL)

from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy.orm import Session
from io import BytesIO

# Local imports from ROOT directory
from db import create_db, get_session
from models import User, History
from auth import decode_token
import ai_utils
from routes_auth import router as auth_router

# ---------------------------------------------------
# INIT
# ---------------------------------------------------

app = FastAPI(title="Study Companion Backend")
security = HTTPBearer()

# ---------------------------------------------------
# CORS
# ---------------------------------------------------

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://studyai-ap6z.onrender.com",
    "https://studycompanion-zcww.onrender.com",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    ALLOWED_ORIGINS.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------
# ROUTES
# ---------------------------------------------------

app.include_router(auth_router)

# ---------------------------------------------------
# DATABASE INIT
# ---------------------------------------------------

@app.on_event("startup")
def init_db():
    create_db()


# ---------------------------------------------------
# CURRENT USER
# ---------------------------------------------------

def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session),
):
    token = creds.credentials
    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid access token")

    email = payload.get("email")
    user = session.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# ---------------------------------------------------
# ROOT
# ---------------------------------------------------

@app.get("/")
def root():
    return {"ok": True}


# ---------------------------------------------------
# PROFILE
# ---------------------------------------------------

@app.get("/profile")
def profile(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    stats = {
        "notes": session.query(History).filter_by(user_id=user.id, feature="notes").count(),
        "flashcards": session.query(History).filter_by(user_id=user.id, feature="flashcards").count(),
        "quiz": session.query(History).filter_by(user_id=user.id, feature="quiz").count(),
        "tutor": session.query(History).filter_by(user_id=user.id, feature="tutor").count(),
    }

    return {
        "email": user.email,
        "created_at": user.created_at,
        "stats": stats,
    }


# ---------------------------------------------------
# ACTIVITY LOGGING
# ---------------------------------------------------

@app.post("/activity/log")
def log_activity(
    payload: dict = Body(...),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if not payload.get("feature"):
        raise HTTPException(status_code=400, detail="feature required")

    entry = History(
        user_id=user.id,
        feature=payload["feature"],
        details=payload.get("details", "")
    )

    session.add(entry)
    session.commit()

    return {"status": "ok"}


@app.get("/activity/history")
def get_history(
    limit: int = 20,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    rows = (
        session.query(History)
        .filter_by(user_id=user.id)
        .order_by(History.created_at.desc())
        .limit(limit)
        .all()
    )

    return {"history": [
        {"feature": r.feature, "details": r.details, "created_at": r.created_at}
        for r in rows
    ]}


# ---------------------------------------------------
# AI ENDPOINTS
# ---------------------------------------------------

@app.post("/ai/notes")
def ai_notes(payload: dict = Body(...), user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    topic = payload.get("topic", "")
    generated = ai_utils.generate_notes(topic)

    session.add(History(user_id=user.id, feature="notes", details=topic))
    session.commit()

    return {"notes": generated}


@app.post("/ai/flashcards")
def ai_flashcards(payload: dict = Body(...), user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    topic = payload.get("topic", "")
    count = int(payload.get("count", 8))

    cards = ai_utils.generate_flashcards(topic, count)

    session.add(History(user_id=user.id, feature="flashcards", details=topic))
    session.commit()

    return {"flashcards": cards}


@app.post("/ai/plan")
def ai_plan(payload: dict = Body(...), user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    topic = payload.get("topic", "")
    plan = ai_utils.generate_plan(topic)

    session.add(History(user_id=user.id, feature="plan", details=topic))
    session.commit()

    return {"plan": plan}


@app.post("/ai/quiz")
def ai_quiz(payload: dict = Body(...), user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    topic = payload.get("topic", "")
    quiz = ai_utils.generate_quiz(topic)

    session.add(History(user_id=user.id, feature="quiz", details=topic))
    session.commit()

    return {"quiz": quiz}


@app.post("/ai/mindmap")
def ai_mindmap(payload: dict = Body(...), user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    topic = payload.get("topic") or payload.get("title")
    text = payload.get("text") or payload.get("content")

    if not text:
        text = ai_utils.generate_notes(topic)

    mm = ai_utils.generate_mindmap_from_text(topic, text)

    session.add(History(user_id=user.id, feature="mindmap", details=topic))
    session.commit()

    return {"mindmap": mm}


@app.post("/ai/mindmap/upload")
async def ai_mindmap_upload(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    contents = await file.read()
    buf = BytesIO(contents)

    text = ai_utils.extract_pdf_text(buf)
    if not text:
        raise HTTPException(status_code=400, detail="PDF extraction failed")

    mm = ai_utils.generate_mindmap_from_text(file.filename, text)

    session.add(History(user_id=user.id, feature="mindmap", details=file.filename))
    session.commit()

    return {"mindmap": mm}


@app.post("/ai/tutor")
def ai_tutor(payload: dict = Body(...), user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    message = payload.get("message", "")
    reply = ai_utils.chat_with_tutor(message)

    session.add(History(user_id=user.id, feature="tutor", details=message[:200]))
    session.commit()

    return {"reply": reply}
