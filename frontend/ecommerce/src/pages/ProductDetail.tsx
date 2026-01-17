import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct, type ProductPublic } from "../api/products";
import { addToCart, formatMoney } from "../store/cart";
import { ApiError } from "../api/client";

export default function ProductDetail() {
  const { slug } = useParams();
  const [p, setP] = useState<ProductPublic | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      setError("");
      try {
        if (!slug) return;
        const data = await getProduct(slug);
        setP(data);
      } catch (e) {
        const msg = e instanceof ApiError ? `${e.status}: ${String(e.detail)}` : "Failed to load product";
        setError(msg);
      }
    })();
  }, [slug]);

  function add() {
    if (!p) return;
    addToCart(
      {
        product_id: p.id,
        slug: p.slug,
        title: p.title,
        unit_price_cents: p.price_cents,
        currency: p.currency
      },
      Math.max(1, qty)
    );
    alert("Added to cart");
  }

  if (error) return <p className="error">{error}</p>;
  if (!p) return <p className="muted">Loading...</p>;

  return (
    <div>
      <div className="row">
        <h1>{p.title}</h1>
        <Link to="/" className="btnSecondary">Back</Link>
      </div>

      <p className="muted">{p.description}</p>
      

      <div className="row">
        <div className="price">{formatMoney(p.price_cents, p.currency)}</div>
        <div className="muted">Stock: {p.stock}</div>
      </div>

      <div className="row">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          style={{ width: 90 }}
        />
        <button onClick={add} disabled={p.stock <= 0}>
          Add to cart
        </button>
        <Link to="/cart" className="btnSecondary">
          Go to cart
        </Link>
      </div>
    </div>
  );
}
