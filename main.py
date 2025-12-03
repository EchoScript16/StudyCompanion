# backend/main.py
from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
security = HTTPBearer()


# local imports
from routes_auth import router as auth_router
from db import create_db

# ---------------------------
# INIT FASTAPI
# ---------------------------
app = FastAPI(title="Study Companion Backend")

# ---------------------------
# FIXED CORS (APPLY BEFORE ROUTERS)
# ---------------------------
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

# ---------------------------
# NOW include routers (after CORS)
# ---------------------------
app.include_router(auth_router)


# ---------------------------
# DATABASE INIT
# ---------------------------
@app.on_event("startup")
def init_db():
    create_db()



# Helper dependency: get_current_user from Authorization header (Bearer token)



def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session),
) -> User:
    token = creds.credentials
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid access token")
    email = payload.get("email")
    # Use SQLAlchemy queries (session is SQLAlchemy Session)
    user = session.query(User).filter(User.email == email).first()
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
    # Use SQLAlchemy queries and len() on lists
    total_notes = len(session.query(History).filter(History.user_id == user.id, History.feature == "notes").all())
    total_flash = len(session.query(History).filter(History.user_id == user.id, History.feature == "flashcards").all())
    total_quiz = len(session.query(History).filter(History.user_id == user.id, History.feature == "quiz").all())
    total_tutor = len(session.query(History).filter(History.user_id == user.id, History.feature == "tutor").all())

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
def log_activity(payload: dict = Body(...), user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    feature = payload.get("feature")
    details = payload.get("details", "")
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
    q = session.query(History).filter(History.user_id == user.id).order_by(History.created_at.desc()).limit(limit).all()
    return {"history": [{"feature": r.feature, "details": r.details, "created_at": r.created_at} for r in q]}


# Dashboard stats aggregated
@app.get("/dashboard/stats")
def dashboard_stats(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    total_entries = session.query(History).filter(History.user_id == user.id).all()
    FEATURES = ["notes", "quiz", "mindmap", "flashcards", "tutor"]

    per_feature = {}
    for f in FEATURES:
        count = session.query(History).filter(History.user_id == user.id, History.feature == f).all()
        per_feature[f] = len(count)

    recent = session.query(History).filter(History.user_id == user.id).order_by(History.created_at.desc()).limit(10).all()

    return {
        "total": len(total_entries),
        "per_feature": per_feature,
        "recent": [
            {"feature": r.feature, "details": r.details, "created_at": r.created_at}
            for r in recent
        ],
    }


# ===== AI / Utility endpoints (protected) =====

# NOTES generator
@app.post("/ai/notes")
def ai_notes(payload: dict = Body(...), session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    topic = payload.get("topic", "")
    out = ai_utils.generate_notes(topic)
    # log
    h = History(user_id=user.id, feature="notes", details=topic)
    session.add(h)
    session.commit()
    return {"notes": out}


# NOTES -> PDF (download)
@app.post("/notes/pdf")
def notes_pdf(payload: dict = Body(...), user: User = Depends(get_current_user)):
    title = payload.get("title") or "notes"
    notes = payload.get("notes")

    if not notes:
        raise HTTPException(status_code=400, detail="notes required")

    try:
        pdf_bytes = ai_utils.notes_to_pdf_bytes(title, notes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {e}")

    headers = {
        "Content-Disposition": f'attachment; filename="{title}.pdf"',
        "Access-Control-Expose-Headers": "Content-Disposition",
    }

    return StreamingResponse(BytesIO(pdf_bytes), media_type="application/pdf", headers=headers)


# FLASHCARDS
@app.post("/ai/flashcards")
def ai_flashcards(payload: dict = Body(...), session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    topic = payload.get("topic", "")
    count = int(payload.get("count", 8))
    out = ai_utils.generate_flashcards(topic, count)
    h = History(user_id=user.id, feature="flashcards", details=f"{topic} ({len(out)})")
    session.add(h)
    session.commit()
    return {"flashcards": out}


# STUDY PLAN
@app.post("/ai/plan")
def ai_plan(payload: dict = Body(...), session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    topic = payload.get("topic", "")
    out = ai_utils.generate_plan(topic)
    h = History(user_id=user.id, feature="plan", details=topic)
    session.add(h)
    session.commit()
    return {"plan": out}


# QUIZ
@app.post("/ai/quiz")
def ai_quiz(payload: dict = Body(...), session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    topic = payload.get("topic", "")
    out = ai_utils.generate_quiz(topic)
    h = History(user_id=user.id, feature="quiz", details=topic)
    session.add(h)
    session.commit()
    return {"quiz": out}


# MINDMAP from text/topic
@app.post("/ai/mindmap")
def ai_mindmap(payload: dict = Body(...), session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    topic = payload.get("topic", "") or payload.get("title", "")
    text = payload.get("text", "") or payload.get("content", "")
    if not text:
        notes = ai_utils.generate_notes(topic or "")
        text = notes
    mindmap = ai_utils.generate_mindmap_from_text(topic or "Mindmap", text)
    h = History(user_id=user.id, feature="mindmap", details=topic or "upload/text")
    session.add(h)
    session.commit()
    return {"mindmap": mindmap}


# Upload PDF -> extract text -> generate mindmap
@app.post("/ai/mindmap/upload")
async def ai_mindmap_upload(file: UploadFile = File(...), session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    contents = await file.read()
    try:
        import io
        buf = io.BytesIO(contents)
        text = ai_utils.extract_pdf_text(buf)
        if not text:
            raise ValueError("PDF text extraction returned empty.")
        mindmap = ai_utils.generate_mindmap_from_text(file.filename or "uploaded", text)
        h = History(user_id=user.id, feature="mindmap", details=f"uploaded:{file.filename}")
        session.add(h)
        session.commit()
        return {"mindmap": mindmap}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Upload or processing failed: {str(e)}")


# TUTOR (chat)
@app.post("/ai/tutor")
def ai_tutor(payload: dict = Body(...), session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    message = payload.get("message", "")
    reply = ai_utils.chat_with_tutor(message)
    h = History(user_id=user.id, feature="tutor", details=message[:200])
    session.add(h)
    session.commit()
    return {"reply": reply}
