# backend/models.py
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from pydantic import BaseModel


# ============================
# User Table
# ============================
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, nullable=False, unique=True)
    password: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship (future expansion)
    # history: list["History"] = Relationship(back_populates="user")


# ============================
# History Table
# ============================
class History(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    feature: str = Field(nullable=False)   # notes, quiz, flashcards, tutor, mindmap
    details: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # user: Optional[User] = Relationship(back_populates="history")


# ============================
# Refresh Token Table
# ============================
class RefreshToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    token: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None


# ============================
# Login Payload Model (Pydantic)
# ============================
class LoginData(BaseModel):
    email: str
    password: str
    remember: bool = True
