export default function Loader({ label = "Loading" }) {
  return (
    <div className="loader">
      <div className="ember-spinner" />
      <span>{label}...</span>
    </div>
  );
}
