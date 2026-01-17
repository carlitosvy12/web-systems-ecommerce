from fastapi import APIRouter, HTTPException, status, Header
from sqlmodel import select

from app.core.security import hash_password, verify_password, create_access_token, get_user_from_token
from app.dependencies import SessionDep
from app.models.user import User, UserCreate, UserPublic

router = APIRouter(prefix="/auth", tags=["auth"])


def get_current_user(session: SessionDep, authorization: str | None = Header(default=None)) -> User:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")

    parts = authorization.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization header")

    token = parts[1].strip()
    user = get_user_from_token(session, token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    return user


@router.post("/register", response_model=UserPublic, status_code=201)
def register(payload: UserCreate, session: SessionDep):
    email = payload.email.strip().lower()

    exists = session.exec(select(User).where(User.email == email)).first()
    if exists:
        raise HTTPException(status_code=409, detail="Email already registered")

    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password too short (min 6)")

    user = User(email=email, password_hash=hash_password(payload.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.post("/login")
def login(payload: UserCreate, session: SessionDep):
    # Reutilizamos UserCreate: {email, password}
    email = payload.email.strip().lower()

    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(subject=user.email)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserPublic)
def me(session: SessionDep, authorization: str | None = Header(default=None)):
    user = get_current_user(session, authorization)
    return user
