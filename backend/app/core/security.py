from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt, JWTError
from passlib.context import CryptContext

from sqlmodel import Session, select

from app.core.config import settings
from app.models.user import User

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_access_token(subject: str) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload: dict[str, Any] = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def get_user_from_token(session: Session, token: str) -> User | None:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        sub = payload.get("sub")
        if not sub:
            return None
    except JWTError:
        return None

    
    stmt = select(User).where(User.email == sub)
    return session.exec(stmt).first()
