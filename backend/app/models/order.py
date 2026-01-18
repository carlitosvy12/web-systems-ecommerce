from datetime import datetime
from sqlmodel import SQLModel, Field


class OrderBase(SQLModel):
    status: str = "pending"  
    total_cents: int
    currency: str = "USD"


class Order(OrderBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class OrderPublic(OrderBase):
    id: int
    user_id: int
    created_at: datetime
