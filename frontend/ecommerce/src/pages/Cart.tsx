import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadCart, updateQuantity, removeFromCart, formatMoney } from "../store/cart";

export default function Cart() {
  const [items, setItems] = useState(loadCart());
  const nav = useNavigate();

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const currency = items[0]?.currency ?? "USD";
  const total = items.reduce((acc, x) => acc + x.unit_price_cents * x.quantity, 0);

  function changeQty(product_id: number, qty: number) {
    setItems(updateQuantity(product_id, qty));
  }

  function remove(product_id: number) {
    setItems(removeFromCart(product_id));
  }

  function goCheckout() {
    if (items.length === 0) return;
    nav("/checkout");
  }

  return (
    <div>
      <div className="row">
        <h1>Cart</h1>
        <Link to="/" className="btnSecondary">Continue shopping</Link>
      </div>

      {items.length === 0 ? (
        <p className="muted">Your cart is empty.</p>
      ) : (
        <>
          <div className="table">
            <div className="tr th">
              <div>Product</div>
              <div>Unit</div>
              <div>Qty</div>
              <div>Subtotal</div>
              <div></div>
            </div>

            {items.map((it) => (
              <div key={it.product_id} className="tr">
                <div>{it.title}</div>
                <div>{formatMoney(it.unit_price_cents, it.currency)}</div>
                <div>
                  <input
                    type="number"
                    min={0}
                    value={it.quantity}
                    onChange={(e) => changeQty(it.product_id, Number(e.target.value))}
                    style={{ width: 90 }}
                  />
                </div>
                <div>{formatMoney(it.unit_price_cents * it.quantity, it.currency)}</div>
                <div>
                  <button className="btnDanger" onClick={() => remove(it.product_id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="price">Total: {formatMoney(total, currency)}</div>
            <button onClick={goCheckout}>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}
