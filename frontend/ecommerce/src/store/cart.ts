export type CartItem = {
  product_id: number;
  slug: string;
  title: string;
  unit_price_cents: number;
  currency: string;
  quantity: number;
};

const CART_KEY = "ecom_cart";

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity: number) {
  const cart = loadCart();
  const idx = cart.findIndex((x) => x.product_id === item.product_id);
  if (idx >= 0) {
    cart[idx].quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }
  saveCart(cart);
  return cart;
}

export function updateQuantity(product_id: number, quantity: number) {
  const cart = loadCart().map((x) => (x.product_id === product_id ? { ...x, quantity } : x));
  const cleaned = cart.filter((x) => x.quantity > 0);
  saveCart(cleaned);
  return cleaned;
}

export function removeFromCart(product_id: number) {
  const cart = loadCart().filter((x) => x.product_id !== product_id);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function cartCount(): number {
  return loadCart().reduce((acc, x) => acc + x.quantity, 0);
}

export function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  return `${amount} ${currency}`;
}
