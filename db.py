import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load DATABASE_URL (Render uses this)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./study.db")

# Render gives postgres:// — SQLAlchemy requires postgresql+pg8000://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+pg8000://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+pg8000://", 1)

# Create engine
engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True,
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base model class
Base = declarative_base()

# Provide DB session to FastAPI routes
def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables at startup
def create_db():
    Base.metadata.create_all(bind=engine)
