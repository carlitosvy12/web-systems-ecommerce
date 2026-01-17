from datetime import datetime
from sqlmodel import SQLModel, Field


class ProductBase(SQLModel):
    title: str
    slug: str = Field(index=True, unique=True)
    description: str = ""
    price_cents: int
    currency: str = "USD"
    stock: int = 0


class Product(ProductBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ProductPublic(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime


class ProductCreate(ProductBase):
    pass


class ProductUpdate(SQLModel):
    title: str | None = None
    slug: str | None = None
    description: str | None = None
    price_cents: int | None = None
    currency: str | None = None
    stock: int | None = None
