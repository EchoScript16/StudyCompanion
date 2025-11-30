# backend/routes_auth.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from models import User, LoginData
from db import get_session
from auth import (
    verify_password,
    create_access_token,
    create_refresh_token,
    hash_password
)

router = APIRouter(prefix="/auth")


# ---------------------- LOGIN ----------------------
@router.post("/login")
def login(data: LoginData, session: Session = Depends(get_session)):

    print("=== LOGIN DEBUG ===")
    print("Email:", data.email)
    print("Password:", data.password)

    # Find user
    user = session.query(User).filter(User.email == data.email).first()
    print("User exists:", bool(user))

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email")

    # Check password
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")

    print("Password match: True")

    # Create tokens
    access_token = create_access_token({"email": user.email})
    refresh_token = create_refresh_token({"email": user.email})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "email": user.email,
    }


# ---------------------- REGISTER ----------------------
@router.post("/register")
def register(data: LoginData, session: Session = Depends(get_session)):

    # Check duplicate email
    existing = session.query(User).filter(User.email == data.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_password = hash_password(data.password)

    # Create user
    new_user = User(
        email=data.email,
        password=hashed_password,
        created_at=datetime.utcnow()
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User registered successfully", "email": new_user.email}
