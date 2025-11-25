# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from io import BytesIO
from typing import List, Optional
from sqlmodel import Session, select

from db import create_db, get_session
from routes_auth import router as auth_router
from models import User, History
import ai_utils  # your ai_utils (generate_notes etc.)
from auth import decode_token  # helper to decode tokens

app = FastAPI(title="Study Companion Backend")
app.include_router(auth_router)

# ==== CORS ====
# Only allow the exact origins you're serving the frontend from.
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
@app.on_event("startup")
def init_db():
    create_db()

# Helper dependency: get_current_user from Authorization header (Bearer token)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
security = HTTPBearer()

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security), session: Session = Depends(get_session)):
    token = creds.credentials
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid access token")
    email = payload.get("email")
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Simple ping root (useful for frontend checks)
@app.get("/")
def root():
    return {"ok": True}

# PROFILE endpoint
@app.get("/profile")
def profile(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # basic stats
    total_notes = session.exec(select(History).where(History.user_id == user.id, History.feature == "notes")).count()
    total_flash = session.exec(select(History).where(History.user_id == user.id, History.feature == "flashcards")).count()
    total_quiz = session.exec(select(History).where(History.user_id == user.id, History.feature == "quiz")).count()
    total_tutor = session.exec(select(History).where(History.user_id == user.id, History.feature == "tutor")).count()

    return {
        "email": user.email,
        "created_at": user.created_at,
        "stats": {
            "notes": total_notes,
            "flashcards": total_flash,
            "quiz": total_quiz,
            "tutor": total_tutor,
        }
    }

# Log activity (protected)
@app.post("/activity/log")
def log_activity(data: dict, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    feature = data.get("feature")
    details = data.get("details", "")
    if not feature:
        raise HTTPException(status_code=400, detail="feature required")
    h = History(user_id=user.id, feature=feature, details=details)
    session.add(h)
    session.commit()
    session.refresh(h)
    return {"status": "ok", "id": h.id}

# Get activity history
@app.get("/activity/history")
def get_history(limit: int = 20, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    q = session.exec(select(History).where(History.user_id == user.id).order_by(History.created_at.desc()).limit(limit)).all()
    return {"history": [ {"feature": r.feature, "details": r.details, "created_at": r.created_at} for r in q ] }

# Dashboard stats aggregated
@app.get("/dashboard/stats")
def dashboard_stats(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):

    total_entries = session.exec(
        select(History).where(History.user_id == user.id)
    ).all()

    FEATURES = ["notes", "quiz", "mindmap", "flashcards", "tutor"]

    per_feature = {}
    for f in FEATURES:
        count = session.exec(
            select(History).where(History.user_id == user.id, History.feature == f)
        ).all()
        per_feature[f] = len(count)

    # Get recent 10 records
    recent = session.exec(
        select(History)
        .where(History.user_id == user.id)
        .order_by(History.created_at.desc())
        .limit(10)
    ).all()

    return {
        "total": len(total_entries),
        "per_feature": per_feature,
        "recent": [
            {
                "feature": r.feature,
                "details": r.details,
                "created_at": r.created_at
            }
            for r in recent
        ]
    }


# ===== AI / Utility endpoints (protected) =====

# NOTES generator (already had similar in your code)
@app.post("/ai/notes")
def ai_notes(data: dict, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    topic = data.get("topic", "")
    out = ai_utils.generate_notes(topic)
    # log
    h = History(user_id=user.id, feature="notes", details=topic)
    session.add(h); session.commit()
    return {"notes": out}

# NOTES -> PDF (download)
from fastapi import Form, Body

@app.post("/notes/pdf")
def notes_pdf(data: dict, user: User = Depends(get_current_user)):
    title = data.get("title") or "notes"
    notes = data.get("notes")

    if not notes:
        raise HTTPException(status_code=400, detail="notes required")

    pdf_bytes = ai_utils.notes_to_pdf_bytes(title, notes)
    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{title}.pdf"'}
    )


# FLASHCARDS (already present)
@app.post("/ai/flashcards")
def ai_flashcards(data: dict, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    topic = data.get("topic", "")
    count = int(data.get("count", 8))
    out = ai_utils.generate_flashcards(topic, count)
    h = History(user_id=user.id, feature="flashcards", details=f"{topic} ({len(out)})")
    session.add(h); session.commit()
    return {"flashcards": out}

# STUDY PLAN
@app.post("/ai/plan")
def ai_plan(data: dict, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    topic = data.get("topic", "")
    out = ai_utils.generate_plan(topic)
    h = History(user_id=user.id, feature="plan", details=topic)
    session.add(h); session.commit()
    return {"plan": out}

# QUIZ
@app.post("/ai/quiz")
def ai_quiz(data: dict, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    topic = data.get("topic", "")
    out = ai_utils.generate_quiz(topic)

    h = History(user_id=user.id, feature="quiz", details=topic)
    session.add(h); session.commit()

    return {"quiz": out}

# MINDMAP from text/topic
@app.post("/ai/mindmap")
def ai_mindmap(data: dict, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    topic = data.get("topic", "") or data.get("title", "")
    text = data.get("text", "") or data.get("content", "")
    # If only topic provided, we will call notes generator to get content snippet OR pass topic as title
    if not text:
        # try generating notes and pass as content
        notes = ai_utils.generate_notes(topic or "")
        text = notes
    mindmap = ai_utils.generate_mindmap_from_text(topic or "Mindmap", text)
    h = History(user_id=user.id, feature="mindmap", details=topic or "upload/text")
    session.add(h); session.commit()
    return {"mindmap": mindmap}

# Upload PDF -> extract text -> generate mindmap
@app.post("/ai/mindmap/upload")
async def ai_mindmap_upload(file: UploadFile = File(...), session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    # Accept PDF file, extract text, then generate mindmap
    contents = await file.read()
    # write to a temp file-like object for extraction
    try:
        import io
        buf = io.BytesIO(contents)
        text = ai_utils.extract_pdf_text(buf)
        if not text:
            raise ValueError("PDF text extraction returned empty.")
        mindmap = ai_utils.generate_mindmap_from_text(file.filename or "uploaded", text)
        h = History(user_id=user.id, feature="mindmap", details=f"uploaded:{file.filename}")
        session.add(h); session.commit()
        return {"mindmap": mindmap}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Upload or processing failed: {str(e)}")

# TUTOR (chat)
@app.post("/ai/tutor")
def ai_tutor(data: dict, session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    message = data.get("message", "")
    reply = ai_utils.chat_with_tutor(message)
    h = History(user_id=user.id, feature="tutor", details=message[:200])
    session.add(h); session.commit()
    return {"reply": reply}
