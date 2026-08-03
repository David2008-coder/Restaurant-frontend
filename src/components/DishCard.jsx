import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function DishCard({ product, settings }) {
  const { addItem } = useCart();
  const currency = settings?.currency_symbol || "₦";

  return (
    <div className="dish">
      <Link to={`/menu/${product.slug}`}>
        <img src={product.main_image} alt={product.name} loading="lazy" />
      </Link>
      <div className="dish-info">
        <span className="cat">{product.category_name}</span>
        <h3>{product.name}</h3>
        <p>{product.short_description}</p>
        <div className="dish-row">
          <span className="dish-price">
            {currency}{Number(product.effective_price).toLocaleString()}
          </span>
          <button
            className="btn small"
            disabled={!product.is_available}
            onClick={() => addItem(product.id, 1)}
          >
            {product.is_available ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
