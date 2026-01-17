import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartCount } from "../store/cart";
import { clearToken, isLoggedIn } from "../store/auth";

export default function Header() {
  const [count, setCount] = useState<number>(cartCount());
  const [logged, setLogged] = useState<boolean>(isLoggedIn());
  const nav = useNavigate();

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount(cartCount());
      setLogged(isLoggedIn());
    }, 300);
    return () => window.clearInterval(id);
  }, []);

  function logout() {
    clearToken();
    setLogged(false);
    nav("/");
  }

  return (
    <header className="header">
      <div className="container headerInner">
        <Link to="/" className="brand">
          E-Commerce
        </Link>

        <nav className="nav">
          <Link to="/">Catalog</Link>
          <Link to="/cart">Cart ({count})</Link>
          {logged ? (
            <>
              <Link to="/orders">Orders</Link>
              <button className="linkBtn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
