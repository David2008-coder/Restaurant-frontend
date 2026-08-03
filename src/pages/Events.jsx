import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { eventsApi } from "../api/services";
import { saveWithImage } from "../api/axiosClient"; // or your utils path
import Loader from "../components/Loader";
import ImageUploadField from "../components/ImageUploadField";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const [imageFile, setImageFile] = useState(null);

  const load = () => {
    setLoading(true);
    eventsApi.list().then((res) => {
      setEvents(res.data.results || res.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const startEdit = (event) => {
    setEditing(event || {});
    setImageFile(null);
    reset(event || { title: "", description: "", event_date: "", start_time: "", is_active: true });
  };

  const onSubmit = async (data) => {
    const fileFields = imageFile ? { banner_image: imageFile } : {};
    if (editing?.id) {
      await saveWithImage(`/events/events/${editing.id}/`, "PATCH", data, fileFields);
    } else {
      await saveWithImage("/events/events/", "POST", data, fileFields);
    }
    setImageFile(null);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this event?")) return;
    await eventsApi.delete(id);
    load();
  };

  if (loading) return <Loader label="Loading events" />;

  return (
    <div className="admin-events">
      <div className="admin-header-row">
        <h1>Events</h1>
        <button className="btn" onClick={() => startEdit({})}>+ New Event</button>
      </div>

      <div className="events-grid">
        {events.map((e) => (
          <div key={e.id} className="event-card">
            {e.banner_image && <img src={e.banner_image} alt={e.title} />}
            <div className="event-card-body">
              <h3>{e.title}</h3>
              <p className="event-date">
                {e.event_date}{e.start_time ? ` · ${e.start_time}` : ""}
              </p>
              <p>{e.description}</p>
              <div className="card-actions">
                <button className="btn ghost small" onClick={() => startEdit(e)}>Edit</button>
                <button className="btn ghost small" onClick={() => remove(e.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing.id ? "Edit Event" : "New Event"}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="stack-form">
              <label>Title<input {...register("title", { required: true })} /></label>
              <label>Description<textarea rows={3} {...register("description")} /></label>

              <ImageUploadField
                label="Banner Image"
                currentUrl={editing?.banner_image}
                onFileSelect={setImageFile}
              />

              <label>Event Date<input type="date" {...register("event_date", { required: true })} /></label>
              <label>Start Time<input type="time" {...register("start_time")} /></label>

              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={() => setEditing(null)}>Cancel</button>
                <button className="btn">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}