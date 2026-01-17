from sqlmodel import SQLModel, Field


class OrderItemBase(SQLModel):
    unit_price_cents: int
    quantity: int = Field(ge=1)


class OrderItem(OrderItemBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id", index=True)
    product_id: int = Field(foreign_key="product.id", index=True)


class OrderItemPublic(OrderItemBase):
    id: int
    order_id: int
    product_id: int
