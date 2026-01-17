from datetime import datetime
from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel, Field
from sqlmodel import select

from app.dependencies import SessionDep
from app.models.order import Order, OrderPublic
from app.models.order_item import OrderItem, OrderItemPublic
from app.models.product import Product
from app.routes.auth import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])


class CartItemIn(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)


class CreateOrderResponse(BaseModel):
    order: OrderPublic
    items: list[OrderItemPublic]


@router.get("", response_model=list[OrderPublic])
def my_orders(session: SessionDep, authorization: str | None = Header(default=None)):
    user = get_current_user(session, authorization)
    stmt = select(Order).where(Order.user_id == user.id).order_by(Order.created_at.desc())
    return list(session.exec(stmt).all())


@router.post("", response_model=CreateOrderResponse, status_code=201)
def create_order(payload: list[CartItemIn], session: SessionDep, authorization: str | None = Header(default=None)):
    user = get_current_user(session, authorization)

    if not payload:
        raise HTTPException(status_code=400, detail="Cart is empty")

    ids = [i.product_id for i in payload]
    products = session.exec(select(Product).where(Product.id.in_(ids))).all()
    by_id = {p.id: p for p in products}

    # Validación fuerte
    currency = None
    total = 0
    for item in payload:
        p = by_id.get(item.product_id)
        if not p:
            raise HTTPException(status_code=400, detail=f"Product not found: {item.product_id}")
        if currency is None:
            currency = p.currency
        if p.currency != currency:
            raise HTTPException(status_code=400, detail="Mixed currencies not supported")
        if item.quantity > p.stock:
            raise HTTPException(status_code=400, detail=f"Not enough stock for product {p.id} (available {p.stock})")
        total += p.price_cents * item.quantity

    now = datetime.utcnow()

    # Transacción: crea order + items + descuenta stock
    try:
        order = Order(
            user_id=user.id,
            status="pending",
            total_cents=total,
            currency=currency or "USD",
            created_at=now,
        )
        session.add(order)
        session.commit()
        session.refresh(order)

        created_items: list[OrderItem] = []
        for item in payload:
            p = by_id[item.product_id]
            p.stock -= item.quantity
            p.updated_at = now
            session.add(p)

            oi = OrderItem(
                order_id=order.id,
                product_id=p.id,
                unit_price_cents=p.price_cents,
                quantity=item.quantity,
            )
            session.add(oi)
            created_items.append(oi)

        session.commit()
        for oi in created_items:
            session.refresh(oi)

    except Exception:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not create order")

    return CreateOrderResponse(order=order, items=created_items)
