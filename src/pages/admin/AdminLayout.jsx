import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/reviews", label: "Reviews" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand script">itagokwaife</div>
        <nav>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "active" : "")}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn ghost small" onClick={logout}>Logout</button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
