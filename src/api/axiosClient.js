// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// const axiosClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// let isRefreshing = false;
// let queue = [];

// const processQueue = (error, token = null) => {
//   queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
//   queue = [];
// };

// axiosClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       const refreshToken = localStorage.getItem("refresh_token");
//       if (!refreshToken) return Promise.reject(error);

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           queue.push({ resolve, reject });
//         }).then((token) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return axiosClient(originalRequest);
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;
//       try {
//         const { data } = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
//         localStorage.setItem("access_token", data.access);
//         processQueue(null, data.access);
//         originalRequest.headers.Authorization = `Bearer ${data.access}`;
//         return axiosClient(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError, null);
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosClient;



import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  queue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) return Promise.reject(error);

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
        localStorage.setItem("access_token", data.access);
        processQueue(null, data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// --- ADDED HELPER FOR IMAGE UPLOADS ---
export const saveWithImage = async (url, data, isEdit = false) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  const config = {
    headers: { "Content-Type": "multipart/form-data" },
  };

  if (isEdit) {
    return await axiosClient.patch(url, formData, config);
  }
  return await axiosClient.post(url, formData, config);
};

export default axiosClient;