import React, { useEffect, useMemo, useState } from "react";
import { listProducts, type ProductPublic } from "../api/products";
import ProductCard from "../components/ProductCard";
import { ApiError } from "../api/client";

export default function Catalog() {
  const [items, setItems] = useState<ProductPublic[]>([]);
  const [q, setQ] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const canSearch = useMemo(() => q.trim().length >= 0, [q]);

  async function load(search?: string) {
    setLoading(true);
    setError("");
    try {
      const data = await listProducts(search?.trim() ? search.trim() : undefined);
      setItems(data);
    } catch (e) {
      const msg = e instanceof ApiError ? `${e.status}: ${String(e.detail)}` : "Failed to load products";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!canSearch) return;
    load(q);
  }

  return (
    <div>
      <h1>Catalog</h1>

      <form onSubmit={onSubmit} className="searchRow">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title/description..."
        />
        <button type="submit">Search</button>
        <button type="button" className="btnSecondary" onClick={() => { setQ(""); load(); }}>
          Reset
        </button>
      </form>

      {loading && <p className="muted">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
