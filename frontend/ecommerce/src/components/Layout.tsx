import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footerInner">CARLOS VICENTE</div>
      </footer>
    </div>
  );
}
