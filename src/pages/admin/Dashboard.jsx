import { useEffect, useState } from "react";
import { ordersApi } from "../../api/services";
import Loader from "../../components/Loader";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => { ordersApi.dashboardStats().then((r) => setStats(r.data)); }, []);

  if (!stats) return <Loader label="Loading dashboard" />;

  const cards = [
    { label: "Today's Orders", value: stats.today_orders },
    { label: "Today's Revenue", value: `₦${Number(stats.today_revenue).toLocaleString()}` },
    { label: "Weekly Revenue", value: `₦${Number(stats.weekly_revenue).toLocaleString()}` },
    { label: "Monthly Revenue", value: `₦${Number(stats.monthly_revenue).toLocaleString()}` },
    { label: "Pending Orders", value: stats.pending_orders },
    { label: "Completed Orders", value: stats.completed_orders },
    { label: "Cancelled Orders", value: stats.cancelled_orders },
    { label: "Reservations Today", value: stats.reservations_today },
  ];

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <div className="stat-grid">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <span className="stat-value">{c.value}</span>
            <span className="stat-label">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-two-col">
        <div className="admin-panel">
          <h3>Recent Orders</h3>
          <table className="admin-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {stats.recent_orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.order_number}</td>
                  <td>{o.full_name}</td>
                  <td>₦{Number(o.grand_total).toLocaleString()}</td>
                  <td><span className={`status-pill ${o.status}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-panel">
          <h3>Popular Products</h3>
          <ul className="popular-list">
            {stats.popular_products.map((p) => (
              <li key={p.product_id}><span>{p.name}</span><span>{p.total_sold} sold</span></li>
            ))}
          </ul>
          {stats.low_stock_products.length > 0 && (
            <>
              <h3>Low Stock Alerts</h3>
              <ul className="popular-list warning">
                {stats.low_stock_products.map((p) => (
                  <li key={p.id}><span>{p.name}</span><span>{p.stock_quantity} left</span></li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
