import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Cart() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [isClearing, setIsClearing] = useState(false);
  const [isRemoving, setIsRemoving] = useState<{[key: string]: boolean}>({});

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: string) => {
    setIsRemoving({ ...isRemoving, [productId]: true });
    try {
      await removeFromCart(productId);
    } finally {
      setIsRemoving({ ...isRemoving, [productId]: false });
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await clearCart();
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : cart && cart.items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <li key={item.productId} className="p-6">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:flex-shrink-0 mb-4 sm:mb-0">
                        <div className="w-full sm:w-24 h-24 relative rounded-md overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 96px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-sm">No image</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 sm:ml-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              <Link href={`/products/${item.productId}`} className="hover:text-green-600">
                                {item.name}
                              </Link>
                            </h3>
                            <p className="mt-1 text-green-600 font-medium">${item.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="mt-4 sm:mt-0 flex items-center">
                            <div className="flex border border-gray-300 rounded-md">
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                className="px-3 py-1 border-r border-gray-300 text-gray-600 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="px-4 py-1 text-center min-w-[40px]">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                className="px-3 py-1 border-l border-gray-300 text-gray-600 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              disabled={isRemoving[item.productId]}
                              className="ml-4 text-red-500 hover:text-red-700"
                            >
                              {isRemoving[item.productId] ? (
                                <div className="w-5 h-5 border-t-2 border-b-2 border-red-500 rounded-full animate-spin"></div>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-gray-500 text-sm">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="text-red-500 hover:text-red-700 flex items-center"
                >
                  {isClearing ? (
                    <div className="w-4 h-4 border-t-2 border-b-2 border-red-500 rounded-full animate-spin mr-2"></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${cart.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${cart.tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-green-600">${cart.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  href={currentUser ? "/checkout" : "/login?redirect=/checkout"}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  {currentUser ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Have a promo code? You'll be able to enter it during checkout.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Looks like you haven't added any products to your cart yet.</p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}