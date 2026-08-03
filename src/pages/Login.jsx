import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch {
      setError("Incorrect email or password.");
    }
  };

  return (
    <section className="auth-page">
      <div className="wrap narrow">
        <h1>Welcome Back</h1>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="stack-form">
          <label>Email<input type="email" {...register("email", { required: true })} /></label>
          <label>Password<input type="password" {...register("password", { required: true })} /></label>
          <button className="btn full" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Login"}</button>
        </form>
        <p className="fine-print">No account? <Link to="/register">Register here</Link></p>
      </div>
    </section>
  );
}
