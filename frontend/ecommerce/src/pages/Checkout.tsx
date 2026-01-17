import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateCart, type ValidateResponse } from "../api/checkout";
import { createOrder } from "../api/orders";
import { loadCart, clearCart, formatMoney } from "../store/cart";
import { ApiError } from "../api/client";

export default function Checkout() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState<ValidateResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [placing, setPlacing] = useState<boolean>(false);

  const cart = loadCart();
  const payload = cart.map((x) => ({ product_id: x.product_id, quantity: x.quantity }));

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");

      if (payload.length === 0) {
        setLoading(false);
        setValid(null);
        return;
      }

      try {
        const res = await validateCart(payload);
        setValid(res);
      } catch (e) {
        const msg = e instanceof ApiError ? `${e.status}: ${String(e.detail)}` : "Checkout validation failed";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allOk = valid?.items.every((x) => x.ok) ?? false;

  async function placeOrder() {
    if (!valid || !allOk) return;
    setPlacing(true);
    setError("");
    try {
      const res = await createOrder(payload);
      clearCart();
      alert(`Order created: #${res.order.id}`);
      nav("/orders");
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status}: ${String(e.detail)}` : "Order failed";
      setError(msg);
    } finally {
      setPlacing(false);
    }
  }

  if (payload.length === 0) {
    return (
      <div>
        <h1>Checkout</h1>
        <p className="muted">Your cart is empty.</p>
        <Link to="/" className="btnSecondary">Go to catalog</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="row">
        <h1>Checkout</h1>
        <Link to="/cart" className="btnSecondary">Back to cart</Link>
      </div>

      {loading && <p className="muted">Validating cart...</p>}
      {error && <p className="error">{error}</p>}

      {valid && (
        <>
          <div className="table">
            <div className="tr th">
              <div>Item</div>
              <div>Unit</div>
              <div>Qty</div>
              <div>Subtotal</div>
              <div>Status</div>
            </div>

            {valid.items.map((it) => (
              <div key={it.product_id} className="tr">
                <div>{it.title}</div>
                <div>{formatMoney(it.unit_price_cents, valid.currency)}</div>
                <div>{it.quantity}</div>
                <div>{formatMoney(it.subtotal_cents, valid.currency)}</div>
                <div className={it.ok ? "ok" : "error"}>
                  {it.ok ? "OK" : it.reason ?? "Invalid"}
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="price">Total: {formatMoney(valid.total_cents, valid.currency)}</div>
            <button onClick={placeOrder} disabled={!allOk || placing}>
              {placing ? "Placing..." : "Place order"}
            </button>
          </div>

          {!allOk && (
            <p className="error">
              Fix cart issues before placing the order (usually stock problems).
            </p>
          )}
        </>
      )}
    </div>
  );
}
