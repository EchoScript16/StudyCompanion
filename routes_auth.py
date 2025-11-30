from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime, timedelta

from models import User, RefreshToken, LoginData
from db import get_session
from auth import verify_password, create_access_token, create_refresh_token, hash_password

router = APIRouter(prefix="/auth")


# ---------------------- LOGIN ----------------------
@router.post("/login")
def login(data: LoginData, session: Session = Depends(get_session)):
    print("=== LOGIN DEBUG ===")
    print("Email:", data.email)
    print("Password:", data.password)

    user = session.query(User).filter(User.email == data.email).first()
    print("User exists:", bool(user))

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email")

    if not verify_password(data.password, user.password):
        print("Password match: False")
        raise HTTPException(status_code=400, detail="Incorrect password")

    print("Password match: True")

    access_token = create_access_token({"email": user.email})
    refresh_token = create_refresh_token({"email": user.email})

    # Save refresh token
    db_token = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(days=14)
    )

    session.add(db_token)
    session.commit()
    session.refresh(db_token)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "email": user.email,
    }


# ---------------------- REGISTER ----------------------
@router.post("/register")
def register(data: LoginData, session: Session = Depends(get_session)):

    # 1. Check for duplicates
    existing = session.query(User).filter(User.email == data.email).first()


    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash password
    hashed_password = hash_password(data.password)

    # 3. Create new user
    new_user = User(
        email=data.email,
        password=hashed_password,
        created_at=datetime.utcnow()
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {
        "message": "User registered successfully",
        "email": new_user.email
    }
