# db.py
import os
from sqlmodel import SQLModel, create_engine, Session

# ─────────────────────────────────────────────────────────────
# Detect database from environment variable (for deployment)
# If DATABASE_URL not provided, fall back to local SQLite
# ─────────────────────────────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///study.db")

# Special handling for SQLite (required by SQLModel)
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# ─────────────────────────────────────────────────────────────
# Create engine (works for SQLite & Postgres)
# ─────────────────────────────────────────────────────────────
engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args=connect_args,
    pool_pre_ping=True
)

# ─────────────────────────────────────────────────────────────
# Session generator  
# ─────────────────────────────────────────────────────────────
def get_session():
    with Session(engine) as session:
        yield session

# ─────────────────────────────────────────────────────────────
# Create all tables
# ─────────────────────────────────────────────────────────────
def create_db():
    SQLModel.metadata.create_all(engine)
