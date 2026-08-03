import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/Loader";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  const load = () => {
    setLoading(true);
    axiosClient.get("/events/events/").then((res) => {
      setEvents(res.data.results || res.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const startEdit = (event) => {
    setEditing(event || {});
    reset(event || { is_active: true });
  };

  const onSubmit = async (data) => {
    if (editing?.id) {
      await axiosClient.patch(`/events/events/${editing.id}/`, data);
    } else {
      await axiosClient.post("/events/events/", data);
    }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this event?")) return;
    await axiosClient.delete(`/events/events/${id}/`);
    load();
  };

  if (loading) return <Loader label="Loading events" />;

  return (
    <div className="admin-products">
      <div className="admin-header-row">
        <h1>Events</h1>
        <button className="btn" onClick={() => startEdit({})}>+ New Event</button>
      </div>

      <table className="admin-table">
        <thead><tr><th>Title</th><th>Date</th><th>Active</th><th></th></tr></thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id}>
              <td>{e.title}</td>
              <td>{e.event_date}</td>
              <td>{e.is_active ? "Yes" : "No"}</td>
              <td>
                <button className="btn ghost small" onClick={() => startEdit(e)}>Edit</button>
                <button className="btn ghost small" onClick={() => remove(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing !== null && (
        <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing.id ? "Edit Event" : "New Event"}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="stack-form">
              <label>Title<input {...register("title", { required: true })} /></label>
              <label>Description<textarea rows={3} {...register("description")} /></label>
              <div className="two-col">
                <label>Event Date<input type="date" {...register("event_date", { required: true })} /></label>
                <label>Start Time<input type="time" {...register("start_time")} /></label>
              </div>
              <label className="checkbox-row"><input type="checkbox" {...register("is_active")} /> Active</label>
              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={() => setEditing(null)}>Cancel</button>
                <button className="btn">Save</button>
              </div>
              <p className="fine-print">Banner image upload: use Django Admin for now, or wire in the Firebase uploader we just set up.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}