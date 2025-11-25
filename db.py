import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Try psycopg2 normally
try:
    import psycopg2
except ImportError:
    psycopg2 = None

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./study.db")

# Fix deprecated URL from Render ("postgres://" → "postgresql://")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Always use the default driver "psycopg2" (NOT psycopg2_binary)
engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_db():
    Base.metadata.create_all(bind=engine)
