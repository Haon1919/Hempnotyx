import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs, query, where, limit } from '@/lib/firebase';
import { db } from '@/lib/firebase';
import { Product } from '@/types';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('featured', '==', true),
          where('inStock', '==', true),
          limit(4)
        );
        
        const querySnapshot = await getDocs(q);
        const products: Product[] = [];
        
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() } as Product);
        });
        
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-96 bg-green-900">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-green-700 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Premium Cannabis Products
          </h1>
          <p className="text-xl text-green-100 mb-8 max-w-2xl">
            Browse our selection of high-quality cannabis products for delivery or pickup.
          </p>
          
          <div>
            <Link 
              href="/products" 
              className="inline-block bg-white text-green-800 font-medium px-6 py-3 rounded-md shadow-md hover:bg-green-50 transition duration-150"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
      
      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Featured Products
        </h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-150">
                  <div className="h-48 relative">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                    <div className="flex justify-between items-center">
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No featured products available.</p>
        )}
        
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-block bg-green-600 text-white font-medium px-6 py-3 rounded-md shadow-md hover:bg-green-700 transition duration-150"
          >
            View All Products
          </Link>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Choose Hempnotyx
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
              <p className="text-gray-600">
                All products are lab-tested with Certificates of Analysis available for complete transparency.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Schedule deliveries to your door or pick up in-store. Live tracking keeps you informed.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Staff</h3>
              <p className="text-gray-600">
                Our knowledgeable team can help you find the perfect products for your needs and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-green-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Browse our selection, create an account, and enjoy premium cannabis products.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/products" 
              className="inline-block bg-white text-green-800 font-medium px-6 py-3 rounded-md shadow-md hover:bg-green-50 transition duration-150"
            >
              Shop Now
            </Link>
            <Link 
              href="/signup" 
              className="inline-block bg-transparent text-white border border-white font-medium px-6 py-3 rounded-md shadow-md hover:bg-green-700 transition duration-150"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}