import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { register: doRegister } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      await doRegister(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.email?.[0] || "Something went wrong.");
    }
  };

  return (
    <section className="auth-page">
      <div className="wrap narrow">
        <h1>Create an Account</h1>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="stack-form">
          <div className="two-col">
            <label>First Name<input {...register("first_name", { required: true })} /></label>
            <label>Last Name<input {...register("last_name", { required: true })} /></label>
          </div>
          <label>Username<input {...register("username", { required: true })} /></label>
          <label>Email<input type="email" {...register("email", { required: true })} /></label>
          <label>Phone<input {...register("phone")} /></label>
          <label>Password<input type="password" {...register("password", { required: true })} /></label>
          <label>Confirm Password<input type="password" {...register("password_confirm", { required: true })} /></label>
          <button className="btn full" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Register"}</button>
        </form>
        <p className="fine-print">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </section>
  );
}
