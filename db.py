# db.py
import os
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./study.db")

# Fix Render's postgres:// → postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine
engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True
)


# Create DB Tables
def create_db():
    from models import User, History, RefreshToken
    SQLModel.metadata.create_all(engine)


# Dependency: SQLModel Session
def get_session():
    with Session(engine) as session:
        yield session
