import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { categoriesApi } from "../../api/services";
import { saveWithImage } from "../../api/axiosClient";
import Loader from "../../components/Loader";
import ImageUploadField from "../../components/ImageUploadField";


export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const [imageFile, setImageFile] = useState(null);

  const load = () => {
    setLoading(true);
    categoriesApi.list().then((res) => {
      setCategories(res.data.results || res.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const startEdit = (category) => {
    setEditing(category || {});
    setImageFile(null);
    reset(category || { is_active: true, display_order: 0 });
  };

  const onSubmit = async (data) => {
    const fileFields = imageFile ? { image: imageFile } : {};
    if (editing?.id) {
      await saveWithImage(`/catalog/categories/${editing.id}/`, "PATCH", data, fileFields);
    } else {
      await saveWithImage("/catalog/categories/", "POST", data, fileFields);
    }
    setImageFile(null);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this category? Products in it will need reassigning.")) return;
    await categoriesApi.delete(id);
    load();
  };

  if (loading) return <Loader label="Loading categories" />;

  return (
    <div className="admin-products">
      <div className="admin-header-row">
        <h1>Categories</h1>
        <button className="btn" onClick={() => startEdit({})}>+ New Category</button>
      </div>
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Products</th>
              <th>Active</th>
              <th>Order</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.product_count}</td>
                <td>{c.is_active ? "Yes" : "No"}</td>
                <td>{c.display_order}</td>
                <td>
                  <button className="btn ghost small" onClick={() => startEdit(c)}>Edit</button>
                  <button className="btn ghost small" onClick={() => remove(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing !== null && (
        <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing.id ? "Edit Category" : "New Category"}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="stack-form">
              <label>Name<input {...register("name", { required: true })} /></label>
              <label>Description<textarea rows={3} {...register("description")} /></label>

              <ImageUploadField
                label="Category Image"
                currentUrl={editing?.image}
                onFileSelect={setImageFile}
              />

              <label>Display Order<input type="number" {...register("display_order")} /></label>
              <label className="checkbox-row">
                <input type="checkbox" {...register("is_active")} /> Active
              </label>

              <div className="modal-actions">
                <button type="button" className="btn ghost" onClick={() => setEditing(null)}>Cancel</button>
                <button className="btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}