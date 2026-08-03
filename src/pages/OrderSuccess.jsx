import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  return (
    <section className="order-success-page">
      <div className="wrap narrow center">
        <div className="eyebrow">Payment Confirmed</div>
        <h1>Your order's on the grill.</h1>
        <p>Order <strong>{orderNumber}</strong> has been received — you'll get updates by phone as it moves through the kitchen.</p>
        <div className="hero-ctas center">
          <Link to="/orders" className="btn">Track Order</Link>
          <Link to="/menu" className="btn ghost">Order More</Link>
        </div>
      </div>
    </section>
  );
}
