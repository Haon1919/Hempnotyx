import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from '@/lib/firebase';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';
import { useRouter } from 'next/router';

type CategoryFilter = string | null;
type StrainFilter = string | null;
type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(null);
  const [strainFilter, setStrainFilter] = useState<StrainFilter>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  // Check for search params in URL
  useEffect(() => {
    if (router.isReady) {
      // Check for 'search' parameter in URL
      const { search } = router.query;
      if (search && typeof search === 'string') {
        setSearchQuery(search);
        console.log('Search query from URL:', search);
      }
      
      // Check for category filter in URL
      const { category } = router.query;
      if (category && typeof category === 'string') {
        setCategoryFilter(category);
      }
      
      // Check for strain filter in URL
      const { strain } = router.query;
      if (strain && typeof strain === 'string') {
        setStrainFilter(strain);
      }
    }
  }, [router.isReady, router.query]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products with debug mode enabled...');
        
        // Import mock data directly to check its contents
        console.log('Importing mock data directly to compare...');
        const { mockData } = require('@/lib/firebase-mock-data');
        console.log('Direct mock data check - Products count:', mockData.products.length);
        
        // Log the database object to see what we're working with
        console.log('Database object:', db);
        
        // Creating a collection reference
        const productsCollection = collection(db, 'products');
        console.log('Products collection reference:', productsCollection);
        
        // Creating a query with ordering
        const q = query(
          productsCollection,
          orderBy('createdAt', 'desc')
        );
        console.log('Query object:', q);
        
        // Fetch the products
        console.log('Executing getDocs...');
        const querySnapshot = await getDocs(q);
        console.log('Query snapshot result:', querySnapshot);
        console.log('Docs count:', querySnapshot.size);
        
        const fetchedProducts: Product[] = [];
        const categoriesSet = new Set<string>();
        
        querySnapshot.forEach((doc) => {
          console.log('Processing doc:', doc.id);
          const product = { id: doc.id, ...doc.data() } as Product;
          console.log('Product data:', product);
          fetchedProducts.push(product);
          
          if (product.category) {
            categoriesSet.add(product.category);
          }
        });
        
        console.log('Total products fetched:', fetchedProducts.length);
        
        // If no products were fetched, use the mock data directly
        if (fetchedProducts.length === 0) {
          console.warn('No products fetched from query, using direct mock data');
          const { mockData } = require('@/lib/firebase-mock-data');
          const directProducts = mockData.products;
          
          console.log('Using direct mock data - count:', directProducts.length);
          setProducts(directProducts);
          setFilteredProducts(directProducts);
          
          // Build categories from direct mock data
          const directCategoriesSet = new Set<string>();
          directProducts.forEach((product: { category?: string }) => {
            if (product.category) {
              directCategoriesSet.add(product.category);
            }
          });
          setCategories(Array.from(directCategoriesSet));
        } else {
          setProducts(fetchedProducts);
          setFilteredProducts(fetchedProducts);
          setCategories(Array.from(categoriesSet));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        
        // On error, use a simple fallback
        const fallbackProducts: Product[] = [
          { 
            id: 'emergency-fallback-1', 
            name: 'Premium CBD Oil', 
            description: 'High-quality CBD oil with full-spectrum extract',
            category: 'CBD Oils',
            price: 49.99,
            cbdContent: 1000,
            strain: 'hybrid',
            inStock: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            images: [],
            stockCount: 10,
            tags: ['cbd', 'oil', 'full-spectrum'],
            featured: false
          },
          { 
            id: 'emergency-fallback-2', 
            name: 'Hemp Flower', 
            description: 'Premium organic hemp flower',
            category: 'Flowers',
            price: 29.99,
            cbdContent: 18,
            strain: 'indica',
            inStock: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            images: [],
            stockCount: 10,
            tags: ['hemp', 'flower', 'indica'],
            featured: false
          }
        ];
        
        setProducts(fallbackProducts);
        setFilteredProducts(fallbackProducts);
        setCategories(['CBD Oils', 'Flowers']);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [db]);

  // Update URL when search query changes
  useEffect(() => {
    if (router.isReady && searchQuery) {
      // Update URL with search parameter without reloading page
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, search: searchQuery }
        },
        undefined,
        { shallow: true }
      );
    } else if (router.isReady && router.query.search && !searchQuery) {
      // Remove search parameter if searchQuery is empty
      const query = { ...router.query };
      delete query.search;
      router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
    }
  }, [searchQuery, router.isReady]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Apply strain filter
    if (strainFilter) {
      result = result.filter(product => product.strain === strainFilter);
    }
    
    // Apply stock filter
    if (!showOutOfStock) {
      result = result.filter(product => product.inStock);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      console.log('Search query:', query); // Debug log
      
      // Split search terms by spaces to support multi-word searches
      const searchTerms = query.split(' ').filter(term => term.length > 0);
      
      if (searchTerms.length > 0) {
        result = result.filter(product => {
          // Check if at least one search term is found in any of the product fields
          return searchTerms.some(term => {
            return (
              (product.name && product.name.toLowerCase().includes(term)) ||
              (product.description && product.description.toLowerCase().includes(term)) ||
              (product.category && product.category.toLowerCase().includes(term)) ||
              (product.subcategory && product.subcategory.toLowerCase().includes(term)) ||
              (product.strain && product.strain.toLowerCase().includes(term)) ||
              (product.tags && product.tags.some(tag => tag.toLowerCase().includes(term)))
            );
          });
        });
      }
      
      console.log('Filtered products count:', result.length); // Debug log
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'price-asc':
        result.sort((a, b) => {
          const aPrice = a.salePrice || a.price;
          const bPrice = b.salePrice || b.price;
          return aPrice - bPrice;
        });
        break;
      case 'price-desc':
        result.sort((a, b) => {
          const aPrice = a.salePrice || a.price;
          const bPrice = b.salePrice || b.price;
          return bPrice - aPrice;
        });
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    setFilteredProducts(result);
  }, [products, categoryFilter, strainFilter, sortOption, showOutOfStock, searchQuery]);

  const resetFilters = () => {
    setCategoryFilter(null);
    setStrainFilter(null);
    setSortOption('newest');
    setShowOutOfStock(false);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-green-600 hover:text-green-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          
          {searchQuery && (
            <div className="bg-green-100 px-4 py-2 rounded-md">
              <p className="text-green-800">
                Showing results for: <span className="font-medium">"{searchQuery}"</span>
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="ml-2 text-green-600 hover:text-green-800"
                  aria-label="Clear search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          {/* Search input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Category filter */}
          <div>
            <select
              value={categoryFilter || ''}
              onChange={(e) => setCategoryFilter(e.target.value || null)}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Strain filter */}
          <div>
            <select
              value={strainFilter || ''}
              onChange={(e) => setStrainFilter(e.target.value || null)}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Strains</option>
              <option value="sativa">Sativa</option>
              <option value="indica">Indica</option>
              <option value="hybrid">Hybrid</option>
              <option value="cbd">CBD</option>
            </select>
          </div>
          
          {/* Sort options */}
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* Stock filter toggle */}
          <div className="flex items-center">
            <input
              id="show-out-of-stock"
              type="checkbox"
              checked={showOutOfStock}
              onChange={(e) => setShowOutOfStock(e.target.checked)}
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="show-out-of-stock" className="ml-2 text-sm text-gray-700">
              Show out of stock
            </label>
          </div>
          
          {/* Reset filters button */}
          {(categoryFilter || strainFilter || sortOption !== 'newest' || showOutOfStock || searchQuery) && (
            <button
              onClick={resetFilters}
              className="text-sm text-green-600 hover:text-green-800 hover:underline"
            >
              Reset filters
            </button>
          )}
          
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {categoryFilter && (
              <div className="inline-flex items-center bg-green-100 px-2 py-1 rounded-md text-sm text-green-800">
                {categoryFilter}
                <button
                  onClick={() => setCategoryFilter(null)}
                  className="ml-1 focus:outline-none"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            
            {strainFilter && (
              <div className="inline-flex items-center bg-green-100 px-2 py-1 rounded-md text-sm text-green-800">
                {strainFilter.charAt(0).toUpperCase() + strainFilter.slice(1)}
                <button
                  onClick={() => setStrainFilter(null)}
                  className="ml-1 focus:outline-none"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          {searchQuery && (
            <p className="mb-4 text-gray-600">
              Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} matching "{searchQuery}"
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          {searchQuery ? (
            <>
              <p className="text-xl text-gray-600">No products found matching "{searchQuery}".</p>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
            </>
          ) : (
            <p className="text-xl text-gray-600">No products found matching your filters.</p>
          )}
          <button
            onClick={resetFilters}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}