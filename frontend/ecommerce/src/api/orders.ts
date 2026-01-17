import { apiRequest } from "./client";
import type { CartItemIn } from "./checkout";

export type OrderPublic = {
  id: number;
  user_id: number;
  status: string;
  total_cents: number;
  currency: string;
  created_at: string;
};

export type OrderItemPublic = {
  id: number;
  order_id: number;
  product_id: number;
  unit_price_cents: number;
  quantity: number;
};

export type CreateOrderResponse = {
  order: OrderPublic;
  items: OrderItemPublic[];
};

export async function myOrders() {
  return apiRequest<OrderPublic[]>({
    method: "GET",
    path: "/orders",
    auth: true
  });
}

export async function createOrder(cart: CartItemIn[]) {
  return apiRequest<CreateOrderResponse>({
    method: "POST",
    path: "/orders",
    auth: true,
    body: cart
  });
}
