import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { productsApi, categoriesApi } from "../../api/services";
import Loader from "../../components/Loader";

import ImageUploadField from "../../components/ImageUploadField";
import { saveWithImage } from "../../api/upload";

/* This CRUD screen is the reusable pattern for the rest of the admin
   dashboard (Categories, Events, Gallery, FAQs, Testimonials all follow the
   same list + slide-over-form shape against their own ViewSet endpoint). */

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const [imageFile, setImageFile] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([productsApi.list(), categoriesApi.list()]).then(([p, c]) => {
      setProducts(p.data.results || p.data);
      setCategories(c.data.results || c.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const startEdit = (product) => {
    setEditing(product || {});
    reset(product || { is_available: true });
  };

  const onSubmit = async (data) => {
  const fileFields = imageFile ? { main_image: imageFile } : {};
  if (editing?.id) {
    await saveWithImage(`/catalog/products/${editing.id}/`, "PATCH", data, fileFields);
  } else {
    await saveWithImage("/catalog/products/", "POST", data, fileFields);
  }
  setImageFile(null);
  setEditing(null);
  load();
};

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await productsApi.remove(id);
    load();
  };

  if (loading) return <Loader label="Loading products" />;

  return (
    <div className="admin-products">
      <div className="admin-header-row">
        <h1>Products</h1>
        <button className="btn" onClick={() => startEdit({})}>+ New Product</button>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Available</th><th>Featured</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><img className="thumb" src={p.main_image} alt={p.name} /></td>
                <td>{p.name}</td>
                <td>{p.category_name}</td>
                <td>₦{Number(p.price).toLocaleString()}</td>
                <td>{p.is_available ? "Yes" : "No"}</td>
                <td>{p.is_featured ? "★" : ""}</td>
                <td>
                  <button className="btn ghost small" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn ghost small" onClick={() => remove(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing !== null && (
        <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing.id ? "Edit Product" : "New Product"}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="stack-form">
              <ImageUploadField
                label="Main Image"
                currentUrl={editing?.main_image}
                onFileSelect={setImageFile}
              />
              <label>Name<input {...register("name", { required: true })} /></label>
              <label>Category
                <select {...register("category_id", { required: true })}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label>Short Description<input {...register("short_description")} /></label>
              <label>Description<textarea rows={3} {...register("description")} /></label>
              <div className="two-col">
                <label>Price<input type="number" step="0.01" {...register("price", { required: true })} /></label>
                <label>Discount Price<input type="number" step="0.01" {...register("discount_price")} /></label>
              </div>
              <div className="two-col">
                <label>Stock Quantity<input type="number" {...register("stock_quantity")} /></label>
                <label>Prep Time (min)<input type="number" {...register("preparation_time")} /></label>
              </div>
              <label className="checkbox-row"><input type="checkbox" {...register("is_available")} /> Available</label>
              <label className="checkbox-row"><input type="checkbox" {...register("is_featured")} /> Featured</label>
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
