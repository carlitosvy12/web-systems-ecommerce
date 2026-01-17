from typing import Annotated
from fastapi import Depends, HTTPException, status
from sqlmodel import Session

from app.db import get_session
from app.core.security import get_user_from_token
from app.models.user import User

SessionDep = Annotated[Session, Depends(get_session)]


def get_bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    # "Bearer <token>"
    parts = authorization.split(" ", 1)
    if len(parts) != 2:
        return None
    if parts[0].lower() != "bearer":
        return None
    return parts[1].strip()


def current_user_required(
    session: SessionDep,
    authorization: Annotated[str | None, Depends(lambda: None)] = None,
) -> User:
    # Este dependency está pensado para usarse desde routes con Header().
    # Lo “inyectaremos” allí correctamente.
    raise NotImplementedError("Use get_current_user dependency from routes/auth helpers.")


def require_user(user: User | None) -> User:
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return user


def require_admin(user: User) -> User:
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user
