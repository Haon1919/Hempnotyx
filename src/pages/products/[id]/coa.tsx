import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { db, doc, getDoc } from '@/lib/firebase';
import { Product, COA } from '@/types';

export default function ProductCOA() {
  const router = useRouter();
  const { id } = router.query;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [coa, setCoa] = useState<COA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductAndCOA = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Use db properly with the mock implementation
        const productRef = doc(db, 'products', id as string);
        const productDoc = await getDoc(productRef);
        
        console.log("Fetching product for COA with ID:", id);
        console.log("productDoc exists:", productDoc.exists());
        console.log("productDoc data:", productDoc.data());
        
        if (!productDoc.exists()) {
          setError('Product not found');
          return;
        }
        
        // Use id from query, data from productDoc
        const productData = {
          id: id as string,
          ...productDoc.data()
        } as Product;
        
        setProduct(productData);
        
        // Check if COA URL exists
        if (!productData.coaUrl) {
          setError('No Certificate of Analysis available for this product');
        }
      } catch (err: any) {
        console.error('Error fetching product or COA:', err);
        setError('Failed to load Certificate of Analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndCOA();
  }, [id]);

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
      <div className="mb-8">
        <Link
          href={`/products/${product.id}`}
          className="inline-flex items-center text-green-600 hover:text-green-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Product
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-16 w-16 relative rounded-md overflow-hidden flex-shrink-0">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 64px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-sm text-gray-500">
                Category: {product.category}{product.subcategory ? ` > ${product.subcategory}` : ''}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Certificate of Analysis (COA)</h2>
          
          {product.coaUrl ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <dt className="text-sm font-medium text-gray-500">Batch Number</dt>
                    <dd className="text-sm text-gray-900">{coa?.batchNumber}</dd>
                    
                    <dt className="text-sm font-medium text-gray-500">Testing Lab</dt>
                    <dd className="text-sm text-gray-900">{coa?.labName}</dd>
                    
                    <dt className="text-sm font-medium text-gray-500">Test Date</dt>
                    <dd className="text-sm text-gray-900">
                      {coa?.testDate ? new Date(coa.testDate).toLocaleDateString() : 'N/A'}
                    </dd>
                    
                    <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                    <dd className="text-sm text-gray-900">
                      {coa?.expirationDate ? new Date(coa.expirationDate).toLocaleDateString() : 'N/A'}
                    </dd>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Cannabinoid Profile</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">THC</span>
                      <span className="text-sm font-medium text-gray-900">
                        {coa?.thcContent !== undefined ? coa.thcContent.toFixed(2) : '0.00'}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${coa?.thcContent !== undefined ? Math.min(coa.thcContent * 3, 100) : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 mb-2">
                      <span className="text-sm font-medium text-gray-900">CBD</span>
                      <span className="text-sm font-medium text-gray-900">
                        {coa?.cbdContent !== undefined ? coa.cbdContent.toFixed(2) : '0.00'}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${coa?.cbdContent !== undefined ? Math.min(coa.cbdContent * 3, 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Full Certificate</h3>
                
                {coa?.fileUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-md border border-gray-300 rounded-lg overflow-hidden">
                      <div className="aspect-w-4 aspect-h-5 bg-gray-100 flex items-center justify-center">
                        <Image
                          src="/pdf-placeholder.png"
                          alt="PDF Preview"
                          width={300}
                          height={400}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <a
                        href={coa.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Download PDF Certificate
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Full certificate PDF is not available at this time. Please contact customer support for assistance.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Certificate Not Available</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      {product.coaUrl 
                        ? 'The certificate of analysis for this product is being processed. Please check back later.'
                        : 'No certificate of analysis is available for this product.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}