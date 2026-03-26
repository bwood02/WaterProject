// when an instance of CartProvider is rendered, it will provide the cart state and the addToCart, removeFromCart, and clearCart functions to all of its child components through the CartContext
// this allows any component within the CartProvider to access and manipulate the cart state without needing to pass props down through multiple levels of the component tree

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CartItem } from '../types/CartItem';

interface CartContextType {
  cart: CartItem[]; // an array of CartItem objects representing the items in the cart
  addToCart: (item: CartItem) => void; // a function that takes a CartItem as an argument and adds it to the cart (returning nothing)
  removeFromCart: (projectId: number) => void;
  clearCart: () => void; // a function that clears all items from the cart
}

const CartContext = createContext<CartContextType | undefined>(undefined); // create a context with the type CartContextType; initial value is undefined

// CartProvider is a component that takes in children as a prop, which represents the components that will be wrapped by the CartProvider and have access to the cart context
export const CartProvider = ({ children }: { children: ReactNode }) => {  
  const [cart, setCart] = useState<CartItem[]>([]); // state for the cart

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((c) => c.projectId === item.projectId); // returns True/False
      // checks if the item being added already exists in the cart by looking for an item with the same projectId
      const updatedCart = prevCart.map(
        (c) =>
          c.projectId === item.projectId
            ? { ...c, donationAmount: c.donationAmount + item.donationAmount }
            : c // if the item already exists, creates a new cart array where the existing item's donationAmount is updated by adding the new donationAmount to it
      );

      return existingItem ? updatedCart : [...prevCart, item];
      // if the item already exists (existingItem is truthy), return the updated cart; otherwise, add the new item to the cart by creating a new array that includes all previous items plus the new item
    });
  };

  const removeFromCart = (projectId: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.projectId !== projectId));
    // removes an item from the cart by filtering out any CartItem whose projectId matches the given projectId
  };

  const clearCart = () => {
    setCart([]); // clears the cart by setting it back to an empty array
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext); // useContext hook to access the CartContext
  if (!context) {
    throw new Error('useCart must be used within a CartProvider'); // if the context is undefined, it means that useCart is being called outside of a CartProvider, so we throw an error to alert the developer
  }
  return context;
};
