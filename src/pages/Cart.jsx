import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Cart() {
  const { cart, removeItem, applyCoupon } = useCart();
  const [code, setCode] = useState("");

  const subtotal = Number(cart.subtotal || 0);
  const discount = Number(cart.discount || 0);

  return (
    <section className="cart-page">
      <div className="wrap narrow">
        <h1>Your Cart</h1>

        {(!cart.items || cart.items.length === 0) ? (
          <p className="empty-state">Your cart is empty. <Link to="/menu">Browse the menu →</Link></p>
        ) : (
          <>
            <div className="cart-list">
              {cart.items.map((item) => (
                <div key={item.id} className="cart-row">
                  <img src={item.product_image} alt={item.product_name} />
                  <div className="cart-row-info">
                    <h4>{item.product_name}</h4>
                    <p>Qty {item.quantity} · ₦{Number(item.unit_price).toLocaleString()}</p>
                  </div>
                  <div className="cart-row-total">₦{Number(item.line_total).toLocaleString()}</div>
                  <button className="btn ghost small" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              ))}
            </div>

            <div className="coupon-row">
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" />
              <button className="btn ghost small" onClick={() => applyCoupon(code)}>Apply</button>
            </div>

            <div className="cart-summary">
              <div><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
              {discount > 0 && <div><span>Discount</span><span>-₦{discount.toLocaleString()}</span></div>}
              <div className="grand"><span>Estimated Total</span><span>₦{(subtotal - discount).toLocaleString()}</span></div>
              <p className="fine-print">Delivery fee and tax are calculated at checkout.</p>
            </div>

            <Link to="/checkout" className="btn full">Proceed to Checkout</Link>
          </>
        )}
      </div>
    </section>
  );
}
