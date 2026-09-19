import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { contentApi } from "../api/services";
import { saveWithImage } from "../api/upload";
import Loader from "../components/Loader";
import ImageUploadField from "../components/ImageUploadField";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const [imageFile, setImageFile] = useState(null);

  const load = () => {
    setLoading(true);
    contentApi.gallery().then((res) => {
      setImages(res.data.results || res.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const startEdit = (item) => {
    setEditing(item || {});
    setImageFile(null);
    reset(item || { caption: "", display_order: 0, is_active: true });
  };

  const onSubmit = async (data) => {
    const fileFields = imageFile ? { image: imageFile } : {};
    if (editing?.id) {
      await saveWithImage(`/content/gallery/${editing.id}/`, "PATCH", data, fileFields);
    } else {
      await saveWithImage("/content/gallery/", "POST", data, fileFields);
    }
    setImageFile(null);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this photo from gallery?")) return;
    await contentApi.deleteGallery(id);
    load();
  };

  if (loading) return <Loader label="Loading the gallery" />;

  return (
    <div className="admin-gallery">
      <div className="admin-header-row">
        <h1>Gallery</h1>
        <button className="btn" onClick={() => startEdit({})}>+ Add Photo</button>
      </div>

      <div className="masonry">
        {images.map((g) => (
          <figure key={g.id} className="gallery-item-card">
            <img src={g.image} alt={g.caption || "Gallery item"} loading="lazy" />
            {g.caption && <figcaption>{g.caption}</figcaption>}
            <div className="card-actions">
              <button className="btn ghost small" onClick={() => startEdit(g)}>Edit</button>
              <button className="btn ghost small" onClick={() => remove(g.id)}>Delete</button>
            </div>
          </figure>
        ))}
      </div>

      {editing !== null && (
        <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing.id ? "Edit Photo" : "Add New Photo"}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="stack-form">
              <label>
                Caption
                <input {...register("caption")} placeholder="Describe this photo..." />
              </label>

              <ImageUploadField
                label="Image"
                currentUrl={editing?.image}
                onFileSelect={setImageFile}
              />

              <label>
                Display Order
                <input type="number" {...register("display_order")} />
              </label>

              <label className="checkbox-row">
                <input type="checkbox" {...register("is_active")} /> Active
              </label>

              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={() => setEditing(null)}>Cancel</button>
                <button className="btn">Save Photo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
