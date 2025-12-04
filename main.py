# ===============================
# main.py  (FULL WORKING VERSION)
# StudyAI Backend
# ===============================

from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from io import BytesIO
from sqlalchemy.orm import Session

# Local imports
from db import create_db, get_session
from models import User, History
from auth import decode_token
import ai_utils

# Auth router
from routes_auth import router as auth_router


# ===============================
# APP INIT
# ===============================
app = FastAPI(title="StudyAI Backend")

security = HTTPBearer()


# ===============================
# CORS SETTINGS
# ===============================
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://studyai-ap6z.onrender.com",     # Your frontend
    "https://studycompanion-zcww.onrender.com",  # Backend URL
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


# ===============================
# INCLUDE AUTH ROUTES
# ===============================
app.include_router(auth_router)


# ===============================
# DATABASE INIT
# ===============================
@app.on_event("startup")
def startup():
    try:
        create_db()
        print("Database Initialized Successfully")
    except Exception as e:
        print("DB Error ->", e)



# ===============================
# AUTH HELPERS
# ===============================
def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session),
) -> User:
    token = creds.credentials
    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = session.query(User).filter(User.email == payload["email"]).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# ===============================
# ROOT
# ===============================
@app.get("/")
def root():
    return {"status": "Backend running", "ok": True}


# ===============================
# PROFILE ROUTE
# ===============================
@app.get("/profile")
def profile(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    total_notes = session.query(History).filter(History.user_id == user.id, History.feature == "notes").count()
    total_flash = session.query(History).filter(History.user_id == user.id, History.feature == "flashcards").count()
    total_quiz = session.query(History).filter(History.user_id == user.id, History.feature == "quiz").count()
    total_tutor = session.query(History).filter(History.user_id == user.id, History.feature == "tutor").count()

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


# ===============================
# ACTIVITY LOG
# ===============================
@app.post("/activity/log")
def log_activity(
    payload: dict = Body(...),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    feature = payload.get("feature")
    details = payload.get("details", "")

    if not feature:
        raise HTTPException(status_code=400, detail="Feature required")

    h = History(user_id=user.id, feature=feature, details=details)
    session.add(h)
    session.commit()
    session.refresh(h)

    return {"status": "ok", "id": h.id}


# ===============================
# ACTIVITY HISTORY
# ===============================
@app.get("/activity/history")
def get_history(
    limit: int = 20,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    q = session.query(History).filter(
        History.user_id == user.id
    ).order_by(History.created_at.desc()).limit(limit).all()

    return {
        "history": [
            {"feature": r.feature, "details": r.details, "created_at": r.created_at}
            for r in q
        ]
    }


# ===============================
# DASHBOARD STATS
# ===============================
@app.get("/dashboard/stats")
def dashboard_stats(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    FEATURES = ["notes", "quiz", "mindmap", "flashcards", "tutor"]

    per_feature = {
        f: session.query(History)
            .filter(History.user_id == user.id, History.feature == f)
            .count()
        for f in FEATURES
    }

    total_entries = session.query(History).filter(History.user_id == user.id).count()

    recent = session.query(History).filter(
        History.user_id == user.id
    ).order_by(History.created_at.desc()).limit(10).all()

    return {
        "total": total_entries,
        "per_feature": per_feature,
        "recent": [
            {"feature": r.feature, "details": r.details, "created_at": r.created_at}
            for r in recent
        ],
    }


# ===============================
# AI – NOTES
# ===============================
@app.post("/ai/notes")
def ai_notes(
    payload: dict = Body(...),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    topic = payload.get("topic", "")
    output = ai_utils.generate_notes(topic)

    session.add(History(user_id=user.id, feature="notes", details=topic))
    session.commit()

    return {"notes": output}


# ===============================
# DOWNLOAD NOTES AS PDF
# ===============================
@app.post("/notes/pdf")
def notes_pdf(payload: dict = Body(...), user: User = Depends(get_current_user)):
    title = payload.get("title", "notes")
    notes = payload.get("notes")

    if not notes:
        raise HTTPException(status_code=400, detail="Notes required")

    pdf_bytes = ai_utils.notes_to_pdf_bytes(title, notes)

    headers = {
        "Content-Disposition": f'attachment; filename="{title}.pdf"',
        "Access-Control-Expose-Headers": "Content-Disposition",
    }

    return StreamingResponse(BytesIO(pdf_bytes), media_type="application/pdf", headers=headers)


# ===============================
# AI – FLASHCARDS
# ===============================
@app.post("/ai/flashcards")
def ai_flashcards(
    payload: dict = Body(...),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    topic = payload.get("topic", "")
    count = int(payload.get("count", 8))

    cards = ai_utils.generate_flashcards(topic, count)

    session.add(History(user_id=user.id, feature="flashcards", details=f"{topic} ({len(cards)})"))
    session.commit()

    return {"flashcards": cards}


# ===============================
# AI – STUDY PLAN
# ===============================
@app.post("/ai/plan")
def ai_plan(
    payload: dict = Body(...),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    topic = payload.get("topic", "")

    plan = ai_utils.generate_plan(topic)

    session.add(History(user_id=user.id, feature="plan", details=topic))
    session.commit()

    return {"plan": plan}


# ===============================
# AI – QUIZ
# ===============================
@app.post("/ai/quiz")
def ai_quiz(
    payload: dict = Body(...),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    topic = payload.get("topic", "")

    quiz = ai_utils.generate_quiz(topic)

    session.add(History(user_id=user.id, feature="quiz", details=topic))
    session.commit()

    return {"quiz": quiz}


# ===============================
# AI – MINDMAP
# ===============================
@app.post("/ai/mindmap")
def ai_mindmap(
    payload: dict = Body(...),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    topic = payload.get("topic") or payload.get("title", "")
    text = payload.get("text") or payload.get("content", "")

    if not text:
        text = ai_utils.generate_notes(topic or "")

    mindmap = ai_utils.generate_mindmap_from_text(topic or "Mindmap", text)

    session.add(History(user_id=user.id, feature="mindmap", details=topic))
    session.commit()

    return {"mindmap": mindmap}


# ===============================
# AI – MINDMAP (UPLOAD PDF)
# ===============================
@app.post("/ai/mindmap/upload")
async def ai_mindmap_upload(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    data = await file.read()

    text = ai_utils.extract_pdf_text(BytesIO(data))

    if not text:
        raise HTTPException(status_code=400, detail="PDF contains no extractable text")

    mindmap = ai_utils.generate_mindmap_from_text(file.filename, text)

    session.add(History(user_id=user.id, feature="mindmap", details=f"upload:{file.filename}"))
    session.commit()

    return {"mindmap": mindmap}


# ===============================
# AI – TUTOR CHAT
# ===============================
@app.post("/ai/tutor")
def ai_tutor(
    payload: dict = Body(...),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    msg = payload.get("message", "")

    reply = ai_utils.chat_with_tutor(msg)

    session.add(History(user_id=user.id, feature="tutor", details=msg[:200]))
    session.commit()

    return {"reply": reply}
