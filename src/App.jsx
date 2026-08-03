import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { contentApi } from "./api/services";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Gallery from "./pages/Gallery";
import Events from "./pages/Events";
import Reservations from "./pages/Reservations";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import StaticPage from "./pages/StaticPage";

import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";

import Categories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import Bookings from "./pages/admin/Bookings";
import AdminEvents from "./pages/admin/Events";
import AdminGallery from "./pages/admin/Gallery";
import AdminReviews from "./pages/admin/Reviews";

export default function App() {
  const [settings, setSettings] = useState(null);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    contentApi.settings().then((r) => setSettings(r.data)).catch(() => {});
    contentApi.contact().then((r) => setContact(r.data)).catch(() => {});
  }, []);

  return (
    <Routes>
      <Route path="/admin/*" element={
        <ProtectedRoute adminOnly>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Categories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="reviews" element={<AdminReviews />} />
              {/* Categories / Orders / Bookings / Events / Gallery / Reviews
                  follow the exact same list+modal pattern as Products. */}
            </Route>
          </Routes>
        </ProtectedRoute>
      } />

      <Route path="*" element={
        <>
          <Navbar logoUrl={settings?.logo} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:slug" element={<Menu />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/events" element={<Events />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
              <Route path="/privacy-policy" element={<StaticPage title="Privacy Policy">Add your policy text here.</StaticPage>} />
              <Route path="/terms" element={<StaticPage title="Terms & Conditions">Add your terms here.</StaticPage>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer settings={settings} contact={contact} />
        </>
      } />
    </Routes>
  );
}
