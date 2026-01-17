from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select

from app.dependencies import SessionDep
from app.models.product import Product, ProductPublic

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductPublic])
def list_products(
    session: SessionDep,
    q: str | None = Query(default=None),
    skip: int = 0,
    limit: int = 50,
):
    stmt = select(Product)

    if q:
        q_like = f"%{q.lower()}%"
        # SQLModel/SQLAlchemy: usamos .like sobre columnas
        stmt = stmt.where((Product.title.ilike(q_like)) | (Product.description.ilike(q_like)))

    stmt = stmt.offset(skip).limit(limit)
    return list(session.exec(stmt).all())


@router.get("/{slug}", response_model=ProductPublic)
def get_product(slug: str, session: SessionDep):
    product = session.exec(select(Product).where(Product.slug == slug)).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


def seed_products_if_empty(session: SessionDep) -> None:
    any_product = session.exec(select(Product)).first()
    if any_product:
        return

    now = datetime.utcnow()
    demo = [
        Product(
            title="Wireless Headphones",
            slug="wireless-headphones",
            description="Comfortable headphones with good battery life.",
            price_cents=5999,
            currency="USD",
            stock=25,
            created_at=now,
            updated_at=now,
        ),
        Product(
            title="Mechanical Keyboard",
            slug="mechanical-keyboard",
            description="Tactile switches, solid build, perfect for typing.",
            price_cents=8999,
            currency="USD",
            stock=10,
            created_at=now,
            updated_at=now,
        ),
        Product(
            title="USB-C Charger",
            slug="usb-c-charger",
            description="Fast charger for phone/laptop (USB-C PD).",
            price_cents=2999,
            currency="USD",
            stock=50,
            created_at=now,
            updated_at=now,
        ),
    ]
    session.add_all(demo)
    session.commit()
