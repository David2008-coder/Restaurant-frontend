import { useEffect, useState } from "react";
import { productsApi, categoriesApi, contentApi } from "../api/services";
import DishCard from "../components/DishCard";
import Loader from "../components/Loader";

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [catRes, settingsRes] = await Promise.all([categoriesApi.list(), contentApi.settings()]);
      setCategories(catRes.data.results || catRes.data);
      setSettings(settingsRes.data);
    })();
  }, []);

  useEffect(() => {
    setLoading(true);
    productsApi.list(activeCategory ? { category: activeCategory } : {}).then((res) => {
      setProducts(res.data.results || res.data);
      setLoading(false);
    });
  }, [activeCategory]);

  return (
    <section className="menu-page">
      <div className="wrap">
        <h1>The Menu</h1>
        <div className="category-pills">
          <button className={activeCategory === "" ? "active" : ""} onClick={() => setActiveCategory("")}>All</button>
          {categories.map((c) => (
            <button key={c.id} className={activeCategory === c.slug ? "active" : ""} onClick={() => setActiveCategory(c.slug)}>
              {c.name}
            </button>
          ))}
        </div>

        {loading ? <Loader label="Loading the menu" /> : (
          <div className="dish-grid">
            {products.map((p) => <DishCard key={p.id} product={p} settings={settings} />)}
            {products.length === 0 && <p className="empty-state">Nothing in this category yet — check back soon.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
