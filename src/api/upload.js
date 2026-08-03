import axiosClient from "./axiosClient";

/**
 * Converts a plain object into FormData, so file inputs and regular
 * fields travel in one multipart request. DRF's ModelViewSets already
 * accept multipart out of the box — no backend change needed.
 */
function toFormData(data, fileFields = {}) {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "boolean") {
      form.append(key, value ? "true" : "false");
    } else {
      form.append(key, value);
    }
  });
  Object.entries(fileFields).forEach(([key, file]) => {
    if (file) form.append(key, file);
  });
  return form;
}

/**
 * Creates or updates a record with optional file(s) attached.
 * fileFields: { main_image: File } etc — only include a key if a new
 * file was actually picked, otherwise the existing image is left alone.
 */
export async function saveWithImage(url, method, data, fileFields = {}) {
  const formData = toFormData(data, fileFields);
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  return method === "POST"
    ? axiosClient.post(url, formData, config)
    : axiosClient.patch(url, formData, config);
}