import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch product
        const productDoc = await getDoc(doc(db, 'products', id as string));
        
        if (!productDoc.exists()) {
          setError('Product not found');
          return;
        }
        
        const productData = { id: productDoc.id, ...productDoc.data() } as Product;
        setProduct(productData);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError('Failed to load product information');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Link
                  href="/products"
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Go back to products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center text-green-600 hover:text-green-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Products
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="lg:flex">
          {/* Product images */}
          <div className="lg:w-1/2">
            <div className="relative h-64 sm:h-80 lg:h-96 w-full">
              {product.images && product.images.length > 0 ? (
                <div className="h-full w-full relative">
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100" 
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2316a34a' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
                    }}
                  >
                    <div className="text-center p-4">
                      <div className="w-16 h-16 mx-auto mb-2 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="block text-lg font-medium text-gray-600">{product.name}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail gallery - disabled for mock data */}
            {/*
            {product.images && product.images.length > 1 && (
              <div className="flex p-4 space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`h-16 w-16 relative flex-shrink-0 border-2 rounded overflow-hidden ${
                      selectedImageIndex === index ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            */}
          </div>
          
          {/* Product details */}
          <div className="lg:w-1/2 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center mb-2">
                <span className="text-sm text-gray-500 capitalize">
                  Category: {product.category}
                  {product.subcategory && ` > ${product.subcategory}`}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500 capitalize">
                  {product.strain || 'N/A'}
                </span>
              </div>
              
              <div className="mt-4 mb-6">
                {product.salePrice ? (
                  <div className="flex items-center">
                    <span className="text-gray-400 line-through mr-2 text-lg">${product.price.toFixed(2)}</span>
                    <span className="text-green-600 font-bold text-2xl">${product.salePrice.toFixed(2)}</span>
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                      {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-green-600 font-bold text-2xl">${product.price.toFixed(2)}</span>
                )}
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              {/* Product details */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Details</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {product.thcContent && (
                    <>
                      <span className="text-sm text-gray-500">THC Content:</span>
                      <span className="text-sm text-gray-900">{product.thcContent}%</span>
                    </>
                  )}
                  
                  {product.cbdContent && (
                    <>
                      <span className="text-sm text-gray-500">CBD Content:</span>
                      <span className="text-sm text-gray-900">{product.cbdContent}%</span>
                    </>
                  )}
                  
                  {product.strain && (
                    <>
                      <span className="text-sm text-gray-500">Strain:</span>
                      <span className="text-sm text-gray-900 capitalize">{product.strain}</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Quantity selector */}
              <div className="mb-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                  >
                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M20 12H4"></path>
                    </svg>
                  </button>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="mx-2 border border-gray-300 p-2 text-center w-16 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-gray-500 focus:outline-none focus:text-gray-600 p-1"
                  >
                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Add to cart button */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !product.inStock}
                  className={`flex-1 px-4 py-3 rounded-md font-medium ${
                    product.inStock 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
                >
                  {isAddingToCart ? (
                    <div className="flex justify-center items-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      <span>Adding...</span>
                    </div>
                  ) : !product.inStock ? (
                    'Out of Stock'
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                
                {product.coaUrl && (
                  <Link
                    href={`/products/${product.id}/coa`}
                    className="px-4 py-3 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    View COA
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 