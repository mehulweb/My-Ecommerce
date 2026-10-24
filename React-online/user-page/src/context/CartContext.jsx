
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item._id === product._id
      );

      const stockAvailable =
        product.stock !== undefined && product.stock !== null;
      const stock = Number(product.stock);

      if (stockAvailable && stock <= 0) {
        return prevItems;
      }

      if (existingItem) {
        return prevItems.map((item) => {
          if (item._id !== product._id) return item;

          const quantity = Number(item.quantity) || 1;

          return {
            ...item,
            quantity: stockAvailable
              ? Math.min(quantity + 1, stock)
              : quantity + 1,
          };
        });
      }

      return [
        ...prevItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addCart }}
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
