export default function Button({ children, variant = "solid", className = "", ...props }) {
  return (
    <button className={`btn ${variant === "ghost" ? "ghost" : ""} ${className}`} {...props}>
      {children}
    </button>
  );
}
