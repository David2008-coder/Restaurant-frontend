import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartApi } from "../api/services";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], subtotal: 0, discount: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await cartApi.get();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (productId, quantity = 1) => {
    const { data } = await cartApi.addItem(productId, quantity);
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const { data } = await cartApi.removeItem(itemId);
    setCart(data);
  };

  const applyCoupon = async (code) => {
    const { data } = await cartApi.applyCoupon(code);
    setCart(data);
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, addItem, removeItem, applyCoupon, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
