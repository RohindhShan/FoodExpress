import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      // Matches Django url: api/orders/cart/
      const res = await api.get("orders/cart/");
      const items = Array.isArray(res.data) ? res.data : res.data.results || [];
      setCartItems(items);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalCartCount = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0,
  );

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, fetchCart, totalCartCount, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
