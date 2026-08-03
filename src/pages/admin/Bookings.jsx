import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/Loader";

const STATUSES = ["pending", "confirmed", "cancelled", "completed"];

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    axiosClient.get("/events/bookings/").then((res) => {
      setBookings(res.data.results || res.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await axiosClient.patch(`/events/bookings/${id}/`, { status });
    load();
  };

  if (loading) return <Loader label="Loading reservations" />;

  return (
    <div className="admin-products">
      <h1>Reservations</h1>
      <div className="admin-table-scroll">
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Phone</th><th>Guests</th><th>Date</th><th>Time</th><th>Request</th><th>Status</th></tr></thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.phone}</td>
              <td>{b.guests}</td>
              <td>{b.date}</td>
              <td>{b.time}</td>
              <td>{b.special_request || "—"}</td>
              <td>
                <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && <tr><td colSpan={7} className="empty-state">No reservations yet.</td></tr>}
        </tbody>
      </table>
      </div>
    </div>
  );
}