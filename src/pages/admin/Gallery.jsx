// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { contentApi } from "../../api/services";
// import axiosClient from "../../api/axiosClient";
// import Loader from "../../components/Loader";

// export default function Gallery() {
//   const [images, setImages] = useState([]);
//   const [editing, setEditing] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { register, handleSubmit, reset } = useForm();

//   const load = () => {
//     setLoading(true);
//     contentApi.gallery().then((res) => {
//       setImages(res.data.results || res.data);
//       setLoading(false);
//     });
//   };

//   useEffect(load, []);

//   const startEdit = (image) => {
//     setEditing(image || {});
//     reset(image || { is_featured: false, is_hidden: false, display_order: 0 });
//   };

//   const onSubmit = async (data) => {
//     if (editing?.id) {
//       await axiosClient.patch(`/content/gallery/${editing.id}/`, data);
//     } else {
//       await axiosClient.post("/content/gallery/", data);
//     }
//     setEditing(null);
//     load();
//   };

//   const remove = async (id) => {
//     if (!confirm("Delete this image?")) return;
//     await axiosClient.delete(`/content/gallery/${id}/`);
//     load();
//   };

//   if (loading) return <Loader label="Loading gallery" />;

//   return (
//     <div className="admin-products">
//       <div className="admin-header-row">
//         <h1>Gallery</h1>
//         <button className="btn" onClick={() => startEdit({})}>+ New Image</button>
//       </div>

//       <table className="admin-table">
//         <thead><tr><th>Image</th><th>Caption</th><th>Featured</th><th>Hidden</th><th></th></tr></thead>
//         <tbody>
//           {images.map((g) => (
//             <tr key={g.id}>
//               <td><img className="thumb" src={g.image} alt={g.caption} /></td>
//               <td>{g.caption}</td>
//               <td>{g.is_featured ? "★" : ""}</td>
//               <td>{g.is_hidden ? "Yes" : "No"}</td>
//               <td>
//                 <button className="btn ghost small" onClick={() => startEdit(g)}>Edit</button>
//                 <button className="btn ghost small" onClick={() => remove(g.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {editing !== null && (
//         <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
//           <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
//             <h3>{editing.id ? "Edit Image" : "New Image"}</h3>
//             <form onSubmit={handleSubmit(onSubmit)} className="stack-form">
//               <label>Caption<input {...register("caption")} /></label>
//               <label>Display Order<input type="number" {...register("display_order")} /></label>
//               <label className="checkbox-row"><input type="checkbox" {...register("is_featured")} /> Featured</label>
//               <label className="checkbox-row"><input type="checkbox" {...register("is_hidden")} /> Hidden</label>
//               <div className="modal-actions">
//                 <button type="button" className="btn ghost" onClick={() => setEditing(null)}>Cancel</button>
//                 <button className="btn">Save</button>
//               </div>
//               <p className="fine-print">Image file upload: use Django Admin for now, or wire in the Firebase uploader.</p>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { contentApi } from "../../api/services";
import axiosClient from "../../api/axiosClient";
import { saveWithImage } from "../../api/upload";
import ImageUploadField from "../../components/ImageUploadField";
import Loader from "../../components/Loader";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  const load = () => {
    setLoading(true);
    contentApi.gallery().then((res) => {
      setImages(res.data.results || res.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const startEdit = (image) => {
    setEditing(image || {});
    setImageFile(null);
    reset(image || { is_featured: false, is_hidden: false, display_order: 0 });
  };

  const onSubmit = async (data) => {
    const fileFields = imageFile ? { image: imageFile } : {};
    if (editing?.id) {
      await saveWithImage(`/content/gallery/${editing.id}/`, "PATCH", data, fileFields);
    } else {
      await saveWithImage("/content/gallery/", "POST", data, fileFields);
    }
    setEditing(null);
    setImageFile(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this image?")) return;
    await axiosClient.delete(`/content/gallery/${id}/`);
    load();
  };

  if (loading) return <Loader label="Loading gallery" />;

  return (
    <div className="admin-products">
      <div className="admin-header-row">
        <h1>Gallery</h1>
        <button className="btn" onClick={() => startEdit({})}>+ New Image</button>
      </div>

      <table className="admin-table">
        <thead><tr><th>Image</th><th>Caption</th><th>Featured</th><th>Hidden</th><th></th></tr></thead>
        <tbody>
          {images.map((g) => (
            <tr key={g.id}>
              <td><img className="thumb" src={g.image} alt={g.caption} /></td>
              <td>{g.caption}</td>
              <td>{g.is_featured ? "★" : ""}</td>
              <td>{g.is_hidden ? "Yes" : "No"}</td>
              <td>
                <button className="btn ghost small" onClick={() => startEdit(g)}>Edit</button>
                <button className="btn ghost small" onClick={() => remove(g.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing !== null && (
        <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing.id ? "Edit Image" : "New Image"}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="stack-form">
              <ImageUploadField
                label="Image"
                currentUrl={editing?.image}
                onFileSelect={setImageFile}
              />
              <label>Caption<input {...register("caption")} /></label>
              <label>Display Order<input type="number" {...register("display_order")} /></label>
              <label className="checkbox-row"><input type="checkbox" {...register("is_featured")} /> Featured</label>
              <label className="checkbox-row"><input type="checkbox" {...register("is_hidden")} /> Hidden</label>
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