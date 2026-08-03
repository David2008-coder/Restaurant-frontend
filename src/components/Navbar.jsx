import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar({ logoUrl }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/menu", label: "Menu" },
    { to: "/gallery", label: "Gallery" },
    { to: "/events", label: "Events" },
    { to: "/reservations", label: "Reservations" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <nav className="wrap nav-inner">
        <Link to="/" className="brand">
          {logoUrl && <img src={logoUrl} alt="Itagokwaife logo" />}
          <span className="script">itagokwaife</span>
        </Link>

        <div className="nav-links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          <Link to="/cart" className="cart-btn" aria-label="Cart">
            <FiShoppingCart size={18} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          {isAuthenticated ? (
            <Link to={user?.role === "admin" ? "/admin" : "/profile"} className="btn ghost small">
              {user?.role === "admin" ? "Dashboard" : "Profile"}
            </Link>
          ) : (
            <Link to="/login" className="btn small">Login</Link>
          )}
          <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mobile-menu">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
