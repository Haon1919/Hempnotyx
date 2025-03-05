import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { currentUser, userData } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(
    userData?.favorites?.includes(product.id) || false
  );
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleFavorite = async () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      window.location.href = `/login?redirect=/products/${product.id}`;
      return;
    }

    setIsTogglingFavorite(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      
      if (isFavorite) {
        // Remove from favorites
        await updateDoc(userRef, {
          favorites: arrayRemove(product.id)
        });
      } else {
        // Add to favorites
        await updateDoc(userRef, {
          favorites: arrayUnion(product.id)
        });
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-150">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="h-48 relative">
            {product.images?.[0] ? (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center text-center">
                <div 
                  className="h-full w-full flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100" 
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2316a34a' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
                  }}
                >
                  <div className="text-center p-4">
                    <div className="w-12 h-12 mx-auto mb-2 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="block text-sm font-medium text-gray-600">{product.name}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
        </Link>
        
        <button
          onClick={toggleFavorite}
          disabled={isTogglingFavorite}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isTogglingFavorite ? (
            <div className="h-6 w-6 flex items-center justify-center">
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 rounded-full border-t-green-600"></div>
            </div>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill={isFavorite ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={isFavorite ? "0" : "2"}
              color={isFavorite ? "#16a34a" : "#9ca3af"}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          )}
        </button>
        
        {!product.inStock && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-md font-medium">
              Out of Stock
            </span>
          </div>
        )}
        
        {product.salePrice && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
            Sale
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        </Link>
        <p className="text-gray-500 text-sm mb-2">{product.category}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            {product.salePrice ? (
              <div className="flex items-center">
                <span className="text-gray-400 line-through mr-2">${product.price.toFixed(2)}</span>
                <span className="text-green-600 font-bold">${product.salePrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-green-600 font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {product.strain && <span className="capitalize">{product.strain}</span>}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || !product.inStock}
            className={`flex-1 px-4 py-2 rounded-md font-medium ${
              product.inStock 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
          >
            {isAddingToCart ? (
              <div className="flex justify-center items-center">
                <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                <span>Adding...</span>
              </div>
            ) : (
              'Add to Cart'
            )}
          </button>
          <Link
            href={`/products/${product.id}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}