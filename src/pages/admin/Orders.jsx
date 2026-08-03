import { useEffect, useState } from "react";
import { ordersApi } from "../../api/services";
import Loader from "../../components/Loader";

const STATUSES = ["pending", "accepted", "rejected", "preparing", "ready", "out_for_delivery", "delivered", "completed", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = () => {
    setLoading(true);
    ordersApi.mine(filter ? { status: filter } : {}).then((res) => {
      setOrders(res.data.results || res.data);
      setLoading(false);
    });
  };

  useEffect(load, [filter]);

  const updateStatus = async (id, status) => {
    await ordersApi.updateStatus(id, { status });
    load();
  };

  if (loading) return <Loader label="Loading orders" />;

  return (
    <div className="admin-products">
      <div className="admin-header-row">
        <h1>Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.order_number}</td>
                <td>{o.full_name}<br /><small>{o.phone}</small></td>
                <td>₦{Number(o.grand_total).toLocaleString()}</td>
                <td><span className={`status-pill ${o.payment_status}`}>{o.payment_status}</span></td>
                <td>
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={6} className="empty-state">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}