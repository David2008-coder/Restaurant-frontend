import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { checkoutApi } from "../api/services";
import { useCart } from "../context/CartContext";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

export default function Checkout() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { fulfilment_type: "delivery" },
  });
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [scriptReady, setScriptReady] = useState(false);
  const fulfilment = watch("fulfilment_type");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => setScriptReady(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const onSubmit = async (data) => {
    const { data: result } = await checkoutApi.checkout(data);

    if (!window.PaystackPop || !scriptReady) {
      // Fallback: some setups redirect instead of using the inline popup.
      window.location.href = result.authorization_url;
      return;
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: data.email,
      amount: Math.round(Number(result.order.grand_total) * 100),
      ref: result.reference,
      callback: (response) => {
        checkoutApi.verifyPayment(response.reference).then(() => {
          refreshCart();
          navigate(`/order-success/${result.order.order_number}`);
        });
      },
      onClose: () => {},
    });
    handler.openIframe();
  };

  return (
    <section className="checkout-page">
      <div className="wrap narrow">
        <h1>Checkout</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="stack-form">
          <label>Full Name
            <input {...register("full_name", { required: true })} />
            {errors.full_name && <span className="error">Required</span>}
          </label>
          <label>Phone
            <input {...register("phone", { required: true })} />
          </label>
          <label>Email
            <input type="email" {...register("email", { required: true })} />
          </label>

          <label>Fulfilment
            <select {...register("fulfilment_type")}>
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </label>

          {fulfilment === "delivery" && (
            <label>Delivery Address
              <input {...register("delivery_address", { required: fulfilment === "delivery" })} />
            </label>
          )}

          <label>Special Instructions
            <textarea rows={3} {...register("special_instructions")} />
          </label>

          <button className="btn full" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Pay with Paystack"}
          </button>
        </form>
      </div>
    </section>
  );
}
