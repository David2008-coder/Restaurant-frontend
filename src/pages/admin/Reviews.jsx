import { useEffect, useState } from "react";
import { reviewsApi } from "../../api/services";
import Loader from "../../components/Loader";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    reviewsApi.list().then((res) => {
      setReviews(res.data.results || res.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const setStatus = async (id, status) => {
    await reviewsApi.updateStatus(id, { status });
    load();
  };

  const toggleFeatured = async (review) => {
    await reviewsApi.updateStatus(review.id, { is_featured: !review.is_featured });
    load();
  };

  if (loading) return <Loader label="Loading reviews" />;

  return (
    <div className="admin-products">
      <h1>Reviews</h1>

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Rating</th><th>Comment</th><th>Status</th><th>Featured</th><th></th></tr></thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{"★".repeat(r.rating)}</td>
                <td>{r.comment}</td>
                <td><span className={`status-pill ${r.status}`}>{r.status}</span></td>
                <td>{r.is_featured ? "★" : ""}</td>
                <td>
                  <button className="btn ghost small" onClick={() => setStatus(r.id, "approved")}>Approve</button>
                  <button className="btn ghost small" onClick={() => setStatus(r.id, "rejected")}>Reject</button>
                  <button className="btn ghost small" onClick={() => toggleFeatured(r)}>{r.is_featured ? "Unfeature" : "Feature"}</button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && <tr><td colSpan={6} className="empty-state">No reviews yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}