from datetime import datetime
from sqlmodel import SQLModel, Field


class UserBase(SQLModel):
    email: str = Field(index=True, unique=True)


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    password_hash: str
    is_admin: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserPublic(UserBase):
    id: int
    is_admin: bool
    created_at: datetime


class UserCreate(SQLModel):
    email: str
    password: str
