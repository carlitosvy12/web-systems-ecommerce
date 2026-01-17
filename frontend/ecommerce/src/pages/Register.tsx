import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, login } from "../api/auth";
import { setToken } from "../store/auth";
import { ApiError } from "../api/client";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await register(email, password);
      const res = await login(email, password);
      setToken(res.access_token);
      nav("/");
    } catch (err) {
      const msg = err instanceof ApiError ? `${err.status}: ${String(err.detail)}` : "Register failed";
      setError(msg);
    }
  }

  return (
    <div className="authBox">
      <h1>Register</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={onSubmit} className="form">
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>
          Password (min 6)
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button type="submit">Create account</button>
      </form>

      <p className="muted">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
