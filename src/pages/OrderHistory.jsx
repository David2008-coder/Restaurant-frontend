import { useEffect, useState } from "react";
import { ordersApi } from "../api/services";
import Loader from "../components/Loader";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.mine().then((res) => {
      setOrders(res.data.results || res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader label="Loading your orders" />;

  return (
    <section className="orders-page">
      <div className="wrap narrow">
        <h1>Order History</h1>
        {orders.length === 0 && <p className="empty-state">No orders yet.</p>}
        <div className="order-list">
          {orders.map((o) => (
            <div key={o.id} className="order-row">
              <div><strong>{o.order_number}</strong><span className={`status-pill ${o.status}`}>{o.status}</span></div>
              <span>₦{Number(o.grand_total).toLocaleString()}</span>
              <span>{new Date(o.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
