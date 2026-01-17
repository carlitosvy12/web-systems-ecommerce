import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { setToken } from "../store/auth";
import { ApiError } from "../api/client";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await login(email, password);
      setToken(res.access_token);
      nav("/");
    } catch (err) {
      const msg = err instanceof ApiError ? `${err.status}: ${String(err.detail)}` : "Login failed";
      setError(msg);
    }
  }

  return (
    <div className="authBox">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={onSubmit} className="form">
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button type="submit">Login</button>
      </form>

      <p className="muted">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
