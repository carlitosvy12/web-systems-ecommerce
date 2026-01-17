import { apiRequest } from "./client";

export type CartItemIn = { product_id: number; quantity: number };

export type ValidatedItem = {
  product_id: number;
  title: string;
  unit_price_cents: number;
  quantity: number;
  subtotal_cents: number;
  ok: boolean;
  reason?: string | null;
};

export type ValidateResponse = {
  currency: string;
  total_cents: number;
  items: ValidatedItem[];
};

export async function validateCart(items: CartItemIn[]) {
  return apiRequest<ValidateResponse>({
    method: "POST",
    path: "/checkout/validate",
    body: items
  });
}
