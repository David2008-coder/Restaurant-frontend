import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <section className="profile-page">
      <div className="wrap narrow">
        <h1>My Profile</h1>
        <div className="profile-card">
          <div><span>Name</span><span>{user.first_name} {user.last_name}</span></div>
          <div><span>Email</span><span>{user.email}</span></div>
          <div><span>Phone</span><span>{user.phone || "—"}</span></div>
          <div><span>Total Orders</span><span>{user.total_orders}</span></div>
          <div><span>Total Spent</span><span>₦{Number(user.total_spent || 0).toLocaleString()}</span></div>
        </div>
      </div>
    </section>
  );
}
