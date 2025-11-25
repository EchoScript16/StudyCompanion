# backend/models.py
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from pydantic import BaseModel

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, nullable=False, unique=True)
    password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # relationship placeholders
    # history: list["History"] = Relationship(back_populates="user")


class History(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    feature: str  # e.g., "notes", "flashcards", "quiz", "tutor"
    details: Optional[str] = None  # optional extra info (topic, filename, summary)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class RefreshToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    token: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None

class LoginData(BaseModel):
    email: str
    password: str
    remember: bool = True