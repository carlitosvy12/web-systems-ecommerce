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
   
    parts = authorization.split(" ", 1)
    if len(parts) != 2:
        return None
    if parts[0].lower() != "bearer":
        return None
    return parts[1].strip()





