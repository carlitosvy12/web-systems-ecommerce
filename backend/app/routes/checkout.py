from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sqlmodel import select

from app.dependencies import SessionDep
from app.models.product import Product

router = APIRouter(prefix="/checkout", tags=["checkout"])


class CartItemIn(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)


class ValidatedItem(BaseModel):
    product_id: int
    title: str
    unit_price_cents: int
    quantity: int
    subtotal_cents: int
    ok: bool
    reason: str | None = None


class ValidateResponse(BaseModel):
    currency: str
    total_cents: int
    items: list[ValidatedItem]


@router.post("/validate", response_model=ValidateResponse)
def validate_cart(payload: list[CartItemIn], session: SessionDep):
    if not payload:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Carga todos los productos de golpe
    ids = [i.product_id for i in payload]
    products = session.exec(select(Product).where(Product.id.in_(ids))).all()
    by_id = {p.id: p for p in products}

    items_out: list[ValidatedItem] = []
    total = 0
    currency = "USD"

    for item in payload:
        p = by_id.get(item.product_id)
        if not p:
            items_out.append(
                ValidatedItem(
                    product_id=item.product_id,
                    title="(missing product)",
                    unit_price_cents=0,
                    quantity=item.quantity,
                    subtotal_cents=0,
                    ok=False,
                    reason="Product not found",
                )
            )
            continue

        currency = p.currency
        if item.quantity > p.stock:
            items_out.append(
                ValidatedItem(
                    product_id=p.id,
                    title=p.title,
                    unit_price_cents=p.price_cents,
                    quantity=item.quantity,
                    subtotal_cents=0,
                    ok=False,
                    reason=f"Not enough stock (available: {p.stock})",
                )
            )
            continue

        subtotal = p.price_cents * item.quantity
        total += subtotal
        items_out.append(
            ValidatedItem(
                product_id=p.id,
                title=p.title,
                unit_price_cents=p.price_cents,
                quantity=item.quantity,
                subtotal_cents=subtotal,
                ok=True,
            )
        )

    return ValidateResponse(currency=currency, total_cents=total, items=items_out)
