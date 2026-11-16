import { createContext, useContext, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addCart = async (product) => {
  const existingItem = cartItems.find(
    (item) => item._id === product._id
  );

  const stock = Number(product.stock);

  if (stock <= 0) {
    toast.error("Product out of stock");
    return;
  }

  const quantity = existingItem
    ? Number(existingItem.quantity) + 1
    : 1;

  if (quantity > stock) {
    toast.error("Insufficient stock");
    return;
  }

  const nextItems = existingItem
    ? cartItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity }
          : item
      )
    : [...cartItems, { ...product, quantity: 1 }];

  setCartItems(nextItems);

  await handelCart(nextItems);
};

const handelCart = async (items) => {
  try {
    const res = await api.post("/cart/addcart", {
      items: items.map((item) => ({
        _id: item._id,
        quantity: Number(item.quantity),
      })),
    });

    if (res.data.success) {
      toast.success("Added to cart");
    }
  } catch (error) {
    console.log("Cart error:", error.response?.data || error);
    toast.error(error.response?.data?.message || "Unable to add cart");
  }
};

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addCart, handelCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};
