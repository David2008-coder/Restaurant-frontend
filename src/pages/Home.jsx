import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contentApi, productsApi } from "../api/services";
import DishCard from "../components/DishCard";
import Loader from "../components/Loader";

export default function Home() {
  const [hero, setHero] = useState(null);
  const [story, setStory] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [heroRes, sectionsRes, productsRes, galleryRes, settingsRes] = await Promise.all([
        contentApi.activeHero(),
        contentApi.homepageSections(),
        productsApi.list({ is_featured: true }),
        contentApi.gallery({ page_size: 6 }),
        contentApi.settings(),
      ]);
      setHero(heroRes.data);
      setStory(sectionsRes.data.results?.find((s) => s.key === "our-story") || sectionsRes.data[0]);
      setFeatured(productsRes.data.results || productsRes.data);
      setGallery(galleryRes.data.results || galleryRes.data);
      setSettings(settingsRes.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader label="Firing up the grill" />;

  return (
    <>
      <section className="hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(12,10,8,.35), rgba(12,10,8,.55) 55%, var(--char-black) 100%), url(${hero?.image})` }}>
        <div className="wrap hero-inner">
          <div className="eyebrow">Lagos · Open-Flame Grill House</div>
          <h1>{hero?.heading}</h1>
          <p>{hero?.subtitle}</p>
          <div className="hero-ctas">
            <Link to={hero?.button_link || "/menu"} className="btn">{hero?.button_text || "See the Menu"}</Link>
            <Link to="/reservations" className="btn ghost">Find Us</Link>
          </div>
        </div>
      </section>

      {story && (
        <section className="story">
          <div className="wrap story-grid">
            <div className="story-media">
              {story.image && <img src={story.image} alt={story.title} />}
            </div>
            <div>
              <div className="eyebrow">The Story</div>
              <h2>{story.title}</h2>
              <p>{story.body}</p>
            </div>
          </div>
        </section>
      )}

      <section className="menu-section">
        <div className="wrap">
          <div className="menu-head">
            <h2>Off the grill, onto your plate.</h2>
            <Link to="/menu" className="btn ghost">View Full Menu</Link>
          </div>
          <div className="dish-grid">
            {featured.map((p) => <DishCard key={p.id} product={p} settings={settings} />)}
          </div>
        </div>
      </section>

      <section className="gallery">
        <div className="wrap">
          <div className="eyebrow">The Grillspot</div>
          <h2>Smoke, coals and the street.</h2>
          <div className="masonry">
            {gallery.map((g) => <img key={g.id} src={g.image} alt={g.caption} />)}
          </div>
        </div>
      </section>
    </>
  );
}
