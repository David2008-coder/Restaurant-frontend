import { useState } from "react";
import { useForm } from "react-hook-form";
import { bookingsApi } from "../api/services";

export default function Reservations() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    await bookingsApi.create(data);
    setSuccess(true);
    reset();
  };

  return (
    <section className="reservations-page">
      <div className="wrap narrow">
        <h1>Reserve a Table</h1>
        <p className="subtitle">Grab a spot on the patio — parties, catering and event bookings welcome too.</p>

        {success && <div className="alert success">Reservation received — we'll confirm by phone shortly.</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="stack-form">
          <label>
            Full Name
            <input {...register("name", { required: true })} placeholder="Your name" />
            {errors.name && <span className="error">Name is required</span>}
          </label>
          <label>
            Phone
            <input {...register("phone", { required: true })} placeholder="+234..." />
            {errors.phone && <span className="error">Phone is required</span>}
          </label>
          <label>
            Email
            <input type="email" {...register("email")} placeholder="you@example.com" />
          </label>
          <div className="two-col">
            <label>
              Guests
              <input type="number" min="1" defaultValue={2} {...register("guests", { required: true, min: 1 })} />
            </label>
            <label>
              Date
              <input type="date" {...register("date", { required: true })} />
            </label>
            <label>
              Time
              <input type="time" {...register("time", { required: true })} />
            </label>
          </div>
          <label>
            Special Request
            <textarea rows={3} {...register("special_request")} placeholder="Birthday, allergy, seating preference..." />
          </label>
          <button className="btn" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Book Your Table"}</button>
        </form>
      </div>
    </section>
  );
}
