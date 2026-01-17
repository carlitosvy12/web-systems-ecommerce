import React, { useEffect, useState } from "react";
import { myOrders, type OrderPublic } from "../api/orders";
import { ApiError } from "../api/client";
import { formatMoney } from "../store/cart";

export default function Orders() {
  const [items, setItems] = useState<OrderPublic[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await myOrders();
        setItems(data);
      } catch (e) {
        const msg = e instanceof ApiError ? `${e.status}: ${String(e.detail)}` : "Failed to load orders";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h1>My Orders</h1>
      {loading && <p className="muted">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {(!loading && items.length === 0) && <p className="muted">No orders yet.</p>}

      <div className="table">
        <div className="tr th">
          <div>ID</div>
          <div>Status</div>
          <div>Total</div>
          <div>Created</div>
        </div>

        {items.map((o) => (
          <div className="tr" key={o.id}>
            <div>#{o.id}</div>
            <div>{o.status}</div>
            <div>{formatMoney(o.total_cents, o.currency)}</div>
            <div>{new Date(o.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
