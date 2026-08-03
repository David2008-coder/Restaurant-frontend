import { useState, useEffect } from "react";

export default function ImageUploadField({ label, currentUrl, onFileSelect }) {
  const [preview, setPreview] = useState(currentUrl || null);

  useEffect(() => { setPreview(currentUrl || null); }, [currentUrl]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <label className="image-upload-field">
      {label}
      {preview && <img src={preview} alt="preview" className="image-upload-preview" />}
      <input type="file" accept="image/*" onChange={handleChange} />
    </label>
  );
}