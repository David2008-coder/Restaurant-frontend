export default function StaticPage({ title, children }) {
  return (
    <section className="static-page">
      <div className="wrap narrow">
        <h1>{title}</h1>
        <div className="static-content">{children}</div>
      </div>
    </section>
  );
}
