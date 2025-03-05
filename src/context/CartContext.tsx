import { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { Cart, CartItem, Product } from '@/types';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const TAX_RATE = 0.08; // 8% tax rate, configure as needed

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  // Load cart when user changes
  useEffect(() => {
    const loadCart = async () => {
      try {
        // Create an empty cart by default
        const emptyCart: Cart = {
          userId: currentUser ? currentUser.uid : 'guest-cart',
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0,
          updatedAt: Date.now()
        };
        
        setCart(emptyCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        // Initialize with an empty cart on error
        setCart({
          userId: currentUser ? currentUser.uid : 'guest-cart',
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0,
          updatedAt: Date.now()
        });
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [currentUser]);

  // Save cart to "database"
  const saveCart = async (updatedCart: Cart) => {
    try {
      // Simply update state - no actual Firebase calls in mock version
      setCart(updatedCart);
      console.log('Cart saved:', updatedCart);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  // Add item to cart
  const addToCart = async (product: Product, quantity: number) => {
    if (!cart) return;
    
    try {
      // Clone current cart
      const updatedCart = { ...cart };
      
      // Check if product already exists in cart
      const existingItemIndex = updatedCart.items.findIndex(
        item => item.productId === product.id
      );
      
      if (existingItemIndex > -1) {
        // Update quantity if product exists
        updatedCart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if product doesn't exist
        updatedCart.items.push({
          productId: product.id,
          quantity,
          price: product.price,
          name: product.name,
          image: product.images?.[0] || undefined
        });
      }
      
      // Update cart totals
      const subtotal = updatedCart.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
      
      updatedCart.subtotal = subtotal;
      updatedCart.tax = subtotal * TAX_RATE;
      updatedCart.total = subtotal + updatedCart.tax;
      updatedCart.updatedAt = Date.now();
      
      await saveCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    if (!cart) return;
    
    try {
      // Create new cart with item removed
      const updatedCart = {
        ...cart,
        items: cart.items.filter(item => item.productId !== productId)
      };
      
      // Update cart totals
      const subtotal = updatedCart.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
      
      updatedCart.subtotal = subtotal;
      updatedCart.tax = subtotal * TAX_RATE;
      updatedCart.total = subtotal + updatedCart.tax;
      updatedCart.updatedAt = Date.now();
      
      await saveCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!cart) return;
    
    try {
      // Clone current cart
      const updatedCart = { ...cart };
      
      // Find the item to update
      const itemIndex = updatedCart.items.findIndex(
        item => item.productId === productId
      );
      
      if (itemIndex === -1) return;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        updatedCart.items = updatedCart.items.filter(
          item => item.productId !== productId
        );
      } else {
        // Update quantity
        updatedCart.items[itemIndex].quantity = quantity;
      }
      
      // Update cart totals
      const subtotal = updatedCart.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 
        0
      );
      
      updatedCart.subtotal = subtotal;
      updatedCart.tax = subtotal * TAX_RATE;
      updatedCart.total = subtotal + updatedCart.tax;
      updatedCart.updatedAt = Date.now();
      
      await saveCart(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Clear the cart
  const clearCart = async () => {
    if (!cart) return;
    
    try {
      // Create empty cart
      const emptyCart: Cart = {
        userId: cart.userId,
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        updatedAt: Date.now()
      };
      
      await saveCart(emptyCart);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}