import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { contentApi } from "../api/services";

export default function Contact() {
  const [contact, setContact] = useState(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [sent, setSent] = useState(false);

  useEffect(() => { contentApi.contact().then((r) => setContact(r.data)); }, []);

  const onSubmit = async () => { setSent(true); reset(); };

  return (
    <section className="contact-page">
      <div className="wrap contact-grid">
        <div>
          <h1>Get In Touch</h1>
          <div className="contact-info">
            <div><b>Address</b><p>{contact?.address}</p></div>
            <div><b>Phone</b><p>{contact?.phone_primary || contact?.whatsapp_number}</p></div>
            <div><b>Email</b><p>{contact?.email}</p></div>
            <div><b>Hours</b><p>{contact?.opening_hours ? Object.values(contact.opening_hours).join(" · ") : ""}</p></div>
          </div>
          <div className="socials">
            {contact?.instagram_url && <a href={contact.instagram_url} target="_blank" rel="noreferrer">IG</a>}
            {contact?.facebook_url && <a href={contact.facebook_url} target="_blank" rel="noreferrer">FB</a>}
            {contact?.whatsapp_number && <a href={`https://wa.me/${contact.whatsapp_number}`} target="_blank" rel="noreferrer">WA</a>}
          </div>
        </div>
        <div className="reserve-card">
          <h3>Send a Message</h3>
          {sent && <div className="alert success">Thanks — we'll get back to you soon.</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="stack-form">
            <label>Name<input {...register("name", { required: true })} /></label>
            <label>Email<input type="email" {...register("email", { required: true })} /></label>
            <label>Message<textarea rows={4} {...register("message", { required: true })} /></label>
            <button className="btn full" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send Message"}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
