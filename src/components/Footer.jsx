import { Link } from "react-router-dom";

export default function Footer({ settings, contact }) {
  return (
    <footer className="site-footer">
      <div className="wrap foot-top">
        <div className="foot-brand">
          {settings?.logo && <img src={settings.logo} alt="logo" />}
          <span className="script">{settings?.site_name || "itagokwaife"}</span>
        </div>
        <div className="foot-links">
          <Link to="/menu">Menu</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/events">Events</Link>
          <Link to="/reservations">Reservations</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
      <div className="wrap foot-bottom">
        <span>© {new Date().getFullYear()} {settings?.site_name || "Itagokwaife Grillspot"}. Grilled fresh in Lagos.</span>
        <span>{contact?.phone_primary || contact?.whatsapp_number}</span>
      </div>
    </footer>
  );
}
