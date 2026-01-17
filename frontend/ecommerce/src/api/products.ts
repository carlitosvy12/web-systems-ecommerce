import { apiRequest } from "./client";

export type ProductPublic = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price_cents: number;
  currency: string;
  stock: number;
  created_at: string;
  updated_at: string;
};

export async function listProducts(q?: string) {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiRequest<ProductPublic[]>({ path: `/products${qs}` });
}

export async function getProduct(slug: string) {
  return apiRequest<ProductPublic>({ path: `/products/${encodeURIComponent(slug)}` });
}
