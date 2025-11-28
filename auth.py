# backend/auth.py
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional, Dict
import os

from sqlmodel import Session, select
from models import User, RefreshToken
from db import get_session, engine

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

JWT_SECRET = os.getenv("JWT_SECRET", "studyai-secret")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_EXPIRE_DAYS", "14"))
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return pwd.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd.verify(password, hashed)

def create_access_token(data: Dict, expires_minutes: Optional[int] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=(expires_minutes or ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)

def create_refresh_token(data: Dict, expires_days: Optional[int] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=(expires_days or REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire, "type": "refresh"})
    token = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    # store in DB
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == data.get("email"))).first()
        if user:
            r = RefreshToken(user_id=user.id, token=token, expires_at=expire)
            session.add(r)
            session.commit()
    return token

def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def revoke_refresh_token(token: str):
    with Session(engine) as session:
        rt = session.exec(select(RefreshToken).where(RefreshToken.token == token)).first()
        if rt:
            session.delete(rt)
            session.commit()
