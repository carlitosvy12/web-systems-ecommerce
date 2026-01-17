import React from "react";
import { Link } from "react-router-dom";
import type { ProductPublic } from "../api/products";
import { formatMoney, addToCart } from "../store/cart";



export default function ProductCard({ p }: { p: ProductPublic }) {
  function add() {
    addToCart(
      {
        product_id: p.id,
        slug: p.slug,
        title: p.title,
        unit_price_cents: p.price_cents,
        currency: p.currency
      },
      1
    );
    alert("Added to cart");
  }

  return (
    <div className="card">
      <img className="productImg" src="/product.jpg" alt={p.title} />

      <div className="cardTitle">
        <Link to={`/product/${p.slug}`}>{p.title}</Link>
      </div>
      <div className="muted">{p.description}</div>
      <div className="row">
        <div className="price">{formatMoney(p.price_cents, p.currency)}</div>
        <div className="muted">Stock: {p.stock}</div>
      </div>
      <div className="row">
        <button onClick={add} disabled={p.stock <= 0}>
          Add
        </button>
        <Link className="btnSecondary" to={`/product/${p.slug}`}>
          Details
        </Link>
      </div>
    </div>
  );
}
