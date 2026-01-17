import React from "react";
import { createBrowserRouter, redirect } from "react-router-dom";
import Layout from "./components/Layout";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import { isLoggedIn } from "./store/auth";

function requireAuth() {
  if (!isLoggedIn()) throw redirect("/login");
  return null;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Catalog /> },
      { path: "product/:slug", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      {
        path: "checkout",
        loader: requireAuth,
        element: <Checkout />
      },
      {
        path: "orders",
        loader: requireAuth,
        element: <Orders />
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> }
    ]
  }
]);
