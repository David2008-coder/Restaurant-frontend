import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="wrap narrow center">
        <div className="eyebrow">404</div>
        <h1>Off the menu.</h1>
        <p>This page doesn't exist — but the grill's still going.</p>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </section>
  );
}
