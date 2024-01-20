import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load cart data from localStorage when the component mounts
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []); 

  const addToCart = (product) => {
    // Check if the product is already in the cart
    const isProductInCart = cart.some((item) => item._id === product._id);

    if (isProductInCart) {
      toast.error('Product is already in the cart');
      return;
    }

    // If not in cart, update the cart
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    toast.success('Product Added into Cart');

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]); 
    localStorage.removeItem('cart'); 
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
