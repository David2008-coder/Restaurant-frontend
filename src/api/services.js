import axiosClient from "./axiosClient";

export const authApi = {
  register: (payload) => axiosClient.post("/auth/register/", payload),
  login: (payload) => axiosClient.post("/auth/login/", payload),
  logout: (refresh) => axiosClient.post("/auth/logout/", { refresh }),
  me: () => axiosClient.get("/auth/me/"),
  updateMe: (payload) => axiosClient.patch("/auth/me/", payload),
};

export const categoriesApi = {
  list: (params) => axiosClient.get("/catalog/categories/", { params }),
};

export const productsApi = {
  list: (params) => axiosClient.get("/catalog/products/", { params }),
  detail: (slug) => axiosClient.get(`/catalog/products/${slug}/`),
  create: (payload) => axiosClient.post("/catalog/products/", payload),
  update: (id, payload) => axiosClient.patch(`/catalog/products/${id}/`, payload),
  remove: (id) => axiosClient.delete(`/catalog/products/${id}/`),
};

export const contentApi = {
  activeHero: () => axiosClient.get("/content/hero/active/"),
  gallery: (params) => axiosClient.get("/content/gallery/", { params }),
  homepageSections: () => axiosClient.get("/content/homepage-sections/"),
  settings: () => axiosClient.get("/content/settings/"),
  contact: () => axiosClient.get("/content/contact/"),
  faqs: () => axiosClient.get("/content/faqs/"),
  testimonials: () => axiosClient.get("/content/testimonials/"),
};

export const eventsApi = {
  list: (params) => axiosClient.get("/events/events/", { params }),
};

export const bookingsApi = {
  create: (payload) => axiosClient.post("/events/bookings/", payload),
  mine: () => axiosClient.get("/events/bookings/"),
};

export const cartApi = {
  get: () => axiosClient.get("/orders/cart/"),
  addItem: (product, quantity = 1, setExact = false) =>
    axiosClient.post("/orders/cart/", { product, quantity, set_exact: setExact }),
  removeItem: (item_id) => axiosClient.delete("/orders/cart/", { data: { item_id } }),
  applyCoupon: (code) => axiosClient.post("/orders/cart/apply-coupon/", { code }),
};

export const checkoutApi = {
  checkout: (payload) => axiosClient.post("/orders/checkout/", payload),
  verifyPayment: (reference) => axiosClient.post("/orders/payments/verify/", { reference }),
};

export const ordersApi = {
  mine: (params) => axiosClient.get("/orders/all/", { params }),
  detail: (id) => axiosClient.get(`/orders/all/${id}/`),
  updateStatus: (id, payload) => axiosClient.patch(`/orders/all/${id}/`, payload),
  dashboardStats: () => axiosClient.get("/orders/dashboard/stats/"),
};

export const reviewsApi = {
  list: (params) => axiosClient.get("/reviews/", { params }),
  create: (payload) => axiosClient.post("/reviews/", payload),
  updateStatus: (id, payload) => axiosClient.patch(`/reviews/${id}/`, payload),
};
