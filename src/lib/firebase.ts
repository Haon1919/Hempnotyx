// Comment out real Firebase initialization
/*
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
*/

// Mock Firebase implementation
class FirestoreDB {
  type = 'firestore';
  toJSON() { return 'Firestore'; }
}

// Mock collection data
const mockData = {
  products: [
    { 
      id: 'hemp-flower-1', 
      name: 'Purple Kush Hemp Flower', 
      description: 'Premium quality hemp flower with a rich terpene profile and a soothing aroma. Perfect for relaxation and stress relief.',
      category: 'Flowers',
      subcategory: 'Premium',
      price: 29.99,
      salePrice: null,
      strain: 'indica',
      thcContent: 0.2,
      cbdContent: 18.5,
      inStock: true,
      stockCount: 50,
      images: ['/images/products/hemp-flower-1.jpg', '/images/products/hemp-flower-1-detail.jpg'],
      barcode: 'HF10012345',
      coaUrl: '/coa/hemp-flower-1.pdf',
      tags: ['premium', 'hemp flower', 'indica', 'relaxation'],
      featured: true,
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000 // 5 days ago
    },
    { 
      id: 'hemp-flower-2', 
      name: 'Sour Space Candy', 
      description: 'A vibrant and energizing hemp flower with sweet and sour notes. Great for daytime use and creative activities.',
      category: 'Flowers',
      subcategory: 'Standard',
      price: 24.99,
      salePrice: 19.99,
      strain: 'sativa',
      thcContent: 0.1,
      cbdContent: 22.3,
      inStock: true,
      stockCount: 35,
      images: ['/images/products/hemp-flower-2.jpg', '/images/products/hemp-flower-2-detail.jpg'],
      barcode: 'HF10012346',
      coaUrl: '/coa/hemp-flower-2.pdf',
      tags: ['standard', 'hemp flower', 'sativa', 'energy'],
      featured: false,
      createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
      updatedAt: Date.now() - 12 * 24 * 60 * 60 * 1000 // 12 days ago
    },
    { 
      id: 'hemp-flower-3', 
      name: 'Special Sauce CBD', 
      description: 'A balanced hemp flower with a unique flavor profile. Perfect for evening relaxation and winding down.',
      category: 'Flowers',
      subcategory: 'Premium',
      price: 32.99,
      salePrice: null,
      strain: 'hybrid',
      thcContent: 0.15,
      cbdContent: 20.1,
      inStock: true,
      stockCount: 28,
      images: ['/images/products/hemp-flower-3.jpg', '/images/products/hemp-flower-3-detail.jpg'],
      barcode: 'HF10012347',
      coaUrl: '/coa/hemp-flower-3.pdf',
      tags: ['premium', 'hemp flower', 'hybrid', 'relaxation'],
      featured: true,
      createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
      updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000 // 3 days ago
    },
    { 
      id: 'cbd-oil-1', 
      name: 'Full Spectrum CBD Oil 1000mg', 
      description: 'High-quality full spectrum CBD oil with natural terpenes. Supports overall wellness and balance in your daily routine.',
      category: 'Oils',
      subcategory: 'Full Spectrum',
      price: 69.99,
      salePrice: null,
      strain: null,
      thcContent: 0.2,
      cbdContent: 1000,
      inStock: true,
      stockCount: 42,
      images: ['/images/products/cbd-oil-1.jpg'],
      barcode: 'CO10012348',
      coaUrl: '/coa/cbd-oil-1.pdf',
      tags: ['cbd oil', 'full spectrum', 'tincture', 'wellness'],
      featured: true,
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
      updatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000 // 15 days ago
    },
    { 
      id: 'cbd-oil-2', 
      name: 'Broad Spectrum CBD Oil 500mg', 
      description: 'Zero-THC broad spectrum CBD oil. Great for those who want the benefits of cannabinoids without any THC.',
      category: 'Oils',
      subcategory: 'Broad Spectrum',
      price: 49.99,
      salePrice: 39.99,
      strain: null,
      thcContent: 0,
      cbdContent: 500,
      inStock: true,
      stockCount: 38,
      images: ['/images/products/cbd-oil-2.jpg'],
      barcode: 'CO10012349',
      coaUrl: '/coa/cbd-oil-2.pdf',
      tags: ['cbd oil', 'broad spectrum', 'tincture', 'THC-free'],
      featured: false,
      createdAt: Date.now() - 55 * 24 * 60 * 60 * 1000, // 55 days ago
      updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000 // 10 days ago
    },
    { 
      id: 'cbd-edible-1', 
      name: 'CBD Gummies 25mg/each (30ct)', 
      description: 'Delicious CBD-infused gummies with 25mg of CBD per piece. A tasty way to incorporate CBD into your daily routine.',
      category: 'Edibles',
      subcategory: 'Gummies',
      price: 44.99,
      salePrice: null,
      strain: null,
      thcContent: 0,
      cbdContent: 25,
      inStock: true,
      stockCount: 60,
      images: ['/images/products/cbd-gummies-1.jpg'],
      barcode: 'CG10012350',
      coaUrl: '/coa/cbd-gummies-1.pdf',
      tags: ['edibles', 'gummies', 'cbd', 'tasty'],
      featured: true,
      createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000, // 40 days ago
      updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days ago
    },
    { 
      id: 'cbd-topical-1', 
      name: 'CBD Muscle Relief Cream 500mg', 
      description: 'Fast-acting CBD cream for sore muscles and joints. Includes menthol and arnica for additional relief.',
      category: 'Topicals',
      subcategory: 'Creams',
      price: 54.99,
      salePrice: 44.99,
      strain: null,
      thcContent: 0,
      cbdContent: 500,
      inStock: true,
      stockCount: 25,
      images: ['/images/products/cbd-cream-1.jpg'],
      barcode: 'CT10012351',
      coaUrl: '/coa/cbd-cream-1.pdf',
      tags: ['topical', 'cream', 'muscle relief', 'menthol'],
      featured: false,
      createdAt: Date.now() - 35 * 24 * 60 * 60 * 1000, // 35 days ago
      updatedAt: Date.now() - 8 * 24 * 60 * 60 * 1000 // 8 days ago
    },
    { 
      id: 'cbd-topical-2', 
      name: 'CBD Skin Serum 250mg', 
      description: 'Luxurious CBD-infused facial serum with antioxidants and essential oils for radiant skin.',
      category: 'Topicals',
      subcategory: 'Skincare',
      price: 64.99,
      salePrice: null,
      strain: null,
      thcContent: 0,
      cbdContent: 250,
      inStock: false,
      stockCount: 0,
      images: ['/images/products/cbd-serum-1.jpg'],
      barcode: 'CS10012352',
      coaUrl: '/coa/cbd-serum-1.pdf',
      tags: ['topical', 'skincare', 'serum', 'beauty'],
      featured: false,
      createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000, // 25 days ago
      updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000 // 2 days ago
    },
    { 
      id: 'cbd-pet-1', 
      name: 'CBD Pet Tincture 300mg', 
      description: 'Specially formulated CBD oil for pets. Supports joint health and calmness in dogs and cats.',
      category: 'Pets',
      subcategory: 'Tinctures',
      price: 39.99,
      salePrice: null,
      strain: null,
      thcContent: 0,
      cbdContent: 300,
      inStock: true,
      stockCount: 30,
      images: ['/images/products/cbd-pet-1.jpg'],
      barcode: 'CP10012353',
      coaUrl: '/coa/cbd-pet-1.pdf',
      tags: ['pet', 'tincture', 'dog', 'cat'],
      featured: false,
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
      updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000 // 1 day ago
    },
    { 
      id: 'cbd-vape-1', 
      name: 'CBD Vape Cartridge 500mg', 
      description: 'High-quality CBD vape cartridge with natural terpenes. Available in multiple strains and flavors.',
      category: 'Vapes',
      subcategory: 'Cartridges',
      price: 34.99,
      salePrice: 29.99,
      strain: 'hybrid',
      thcContent: 0.1,
      cbdContent: 500,
      inStock: true,
      stockCount: 22,
      images: ['/images/products/cbd-vape-1.jpg'],
      barcode: 'CV10012354',
      coaUrl: '/coa/cbd-vape-1.pdf',
      tags: ['vape', 'cartridge', 'cbd', 'terpenes'],
      featured: true,
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
      updatedAt: Date.now() // today
    },
    { 
      id: 'cbd-isolate-1', 
      name: 'Pure CBD Isolate Powder', 
      description: 'Highly refined CBD isolate in powder form. 99.9% pure CBD with no THC. Perfect for custom formulations and precise dosing.',
      category: 'Concentrates',
      subcategory: 'Isolate',
      price: 49.99,
      salePrice: 39.99,
      strain: null,
      thcContent: 0,
      cbdContent: 99.9,
      inStock: true,
      stockCount: 25,
      images: ['/images/products/cbd-isolate-1.jpg'],
      barcode: 'CI10012355',
      coaUrl: '/coa/cbd-isolate-1.pdf',
      tags: ['isolate', 'concentrate', 'pure', 'thc-free', 'powder'],
      featured: false,
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000
    },
    { 
      id: 'cbd-capsules-1', 
      name: 'Full Spectrum CBD Capsules 50mg', 
      description: 'Easy-to-swallow CBD capsules with 50mg of full spectrum hemp extract per capsule. Great for on-the-go convenience and precise dosing.',
      category: 'Capsules',
      subcategory: 'Full Spectrum',
      price: 64.99,
      salePrice: null,
      strain: null,
      thcContent: 0.2,
      cbdContent: 50,
      inStock: true,
      stockCount: 40,
      images: ['/images/products/cbd-capsules-1.jpg'],
      barcode: 'CC10012356',
      coaUrl: '/coa/cbd-capsules-1.pdf',
      tags: ['capsules', 'full-spectrum', 'easy', 'convenient', 'daily'],
      featured: true,
      createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000
    },
    { 
      id: 'cbd-salve-1', 
      name: 'CBD Healing Salve with Arnica', 
      description: 'Soothing CBD salve infused with arnica, essential oils, and healing herbs. Targets sore muscles and joints with localized relief.',
      category: 'Topicals',
      subcategory: 'Salves',
      price: 45.99,
      salePrice: null,
      strain: null,
      thcContent: 0,
      cbdContent: 500,
      inStock: true,
      stockCount: 30,
      images: ['/images/products/cbd-salve-1.jpg'],
      barcode: 'CS10012357',
      coaUrl: '/coa/cbd-salve-1.pdf',
      tags: ['topical', 'salve', 'arnica', 'pain-relief', 'natural'],
      featured: false,
      createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 4 * 24 * 60 * 60 * 1000
    },
    { 
      id: 'delta8-gummies-1', 
      name: 'Delta-8 THC Gummies 25mg', 
      description: 'Legal hemp-derived Delta-8 THC gummies with 25mg per piece. Offers a mild psychoactive effect with less intensity than Delta-9 THC.',
      category: 'Edibles',
      subcategory: 'Delta-8',
      price: 34.99,
      salePrice: 29.99,
      strain: null,
      thcContent: 25,
      cbdContent: 0,
      inStock: true,
      stockCount: 20,
      images: ['/images/products/delta8-gummies-1.jpg'],
      barcode: 'DG10012358',
      coaUrl: '/coa/delta8-gummies-1.pdf',
      tags: ['delta-8', 'edibles', 'gummies', 'thc', 'legal'],
      featured: true,
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now()
    }
  ],
  
  users: [
    {
      id: 'user1',
      email: 'customer@example.com',
      displayName: 'Test Customer',
      role: 'customer',
      phone: '555-123-4567',
      address: {
        street: '123 Main St',
        city: 'Portland',
        state: 'OR',
        zip: '97201',
        notes: 'Front door code: 1234'
      },
      favorites: ['hemp-flower-1', 'cbd-oil-1'],
      orderHistory: ['order1', 'order2'],
      createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000
    },
    {
      id: 'admin1',
      email: 'admin@example.com',
      displayName: 'Admin User',
      role: 'admin',
      phone: '555-987-6543',
      createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'driver1',
      email: 'driver@example.com',
      displayName: 'Delivery Driver',
      role: 'driver',
      phone: '555-456-7890',
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000
    }
  ],
  
  orders: [
    {
      id: 'order1',
      userId: 'user1',
      userEmail: 'customer@example.com',
      userName: 'Test Customer',
      items: [
        {
          productId: 'hemp-flower-1',
          quantity: 2,
          price: 29.99,
          name: 'Purple Kush Hemp Flower',
          image: '/images/products/hemp-flower-1.jpg'
        },
        {
          productId: 'cbd-oil-1',
          quantity: 1,
          price: 69.99,
          name: 'Full Spectrum CBD Oil 1000mg',
          image: '/images/products/cbd-oil-1.jpg'
        }
      ],
      subtotal: 129.97,
      tax: 13.00,
      total: 142.97,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      fulfillmentMethod: 'delivery',
      deliveryAddress: {
        street: '123 Main St',
        city: 'Portland',
        state: 'OR',
        zip: '97201',
        notes: 'Front door code: 1234'
      },
      deliveryFee: 5.00,
      driverId: 'driver1',
      scheduledFor: Date.now() - 10 * 24 * 60 * 60 * 1000,
      orderReceived: Date.now() - 15 * 24 * 60 * 60 * 1000,
      orderProcessing: Date.now() - 14 * 24 * 60 * 60 * 1000,
      orderReady: Date.now() - 13 * 24 * 60 * 60 * 1000,
      orderPickedUpByDriver: Date.now() - 12 * 24 * 60 * 60 * 1000,
      orderDelivered: Date.now() - 10 * 24 * 60 * 60 * 1000,
      idVerified: true,
      notes: 'Please deliver after 5pm',
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000
    },
    {
      id: 'order2',
      userId: 'user1',
      userEmail: 'customer@example.com',
      userName: 'Test Customer',
      items: [
        {
          productId: 'cbd-edible-1',
          quantity: 1,
          price: 44.99,
          name: 'CBD Gummies 25mg/each (30ct)',
          image: '/images/products/cbd-gummies-1.jpg'
        }
      ],
      subtotal: 44.99,
      tax: 4.50,
      total: 49.49,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'online',
      fulfillmentMethod: 'pickup',
      scheduledFor: Date.now() + 2 * 24 * 60 * 60 * 1000,
      orderReceived: Date.now() - 1 * 24 * 60 * 60 * 1000,
      orderProcessing: Date.now(),
      idVerified: false,
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now()
    }
  ]
};

// Log mock data to verify it's loaded
console.log('Mock data initialized. Products count:', mockData.products.length);
console.log('Sample product names:', mockData.products.slice(0, 3).map(p => p.name));

// Mock Firestore functions
export const collection = (db, collectionName) => {
  console.log(`collection() called with: db=${JSON.stringify(db)}, collectionName=${collectionName}`);
  
  // If db has a collection method, use it directly
  if (db && typeof db.collection === 'function') {
    console.log('Using db.collection() method directly');
    return db.collection(collectionName);
  }
  
  // Otherwise use the mock implementation
  console.log('Using generic mock collection implementation');
  return { 
    id: collectionName, 
    path: collectionName,
    type: 'collection'
  };
};

export const orderBy = (field, direction = 'asc') => ({
  type: 'orderBy',
  field,
  direction
});

export const getDocs = async (querySnapshot) => {
  console.log('getDocs called with:', querySnapshot);
  
  // Determine which collection was queried
  let collectionName = 'products'; // Default to products
  
  if (querySnapshot && querySnapshot.path) {
    collectionName = querySnapshot.path;
    console.log(`Using path from querySnapshot: ${collectionName}`);
  }
  
  // Get the mock products
  const products = [...(mockData[collectionName] || [])];
  console.log(`Found ${products.length} products in mock data`);
  
  // Log some sample timestamps to verify the format
  if (products.length > 0) {
    console.log('Sample product timestamp:', products[0].createdAt, 'type:', typeof products[0].createdAt);
  }
  
  // Apply any query constraints if they exist
  if (querySnapshot && querySnapshot._queryConstraints && querySnapshot._queryConstraints.length > 0) {
    console.log('Applying query constraints...');
    
    // Look for orderBy constraints
    const orderByConstraints = querySnapshot._queryConstraints.filter(c => c.type === 'orderBy');
    if (orderByConstraints.length > 0) {
      console.log('Found orderBy constraints:', orderByConstraints);
      
      // Apply the first orderBy constraint
      const { field, direction } = orderByConstraints[0];
      console.log(`Sorting by ${field} ${direction}`);
      
      products.sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];
        
        // Ensure we have valid values to compare
        if (aValue === undefined) aValue = 0;
        if (bValue === undefined) bValue = 0;
        
        // Convert string timestamps to numbers if needed
        if (typeof aValue === 'string' && !isNaN(Date.parse(aValue))) {
          aValue = Date.parse(aValue);
        }
        if (typeof bValue === 'string' && !isNaN(Date.parse(bValue))) {
          bValue = Date.parse(bValue);
        }
        
        if (direction === 'desc') {
          return bValue - aValue; // Numeric comparison for desc
        } else {
          return aValue - bValue; // Numeric comparison for asc
        }
      });
      
      if (products.length > 0) {
        console.log('First sorted product:', products[0].name, 'createdAt:', products[0].createdAt);
      }
    }
  }
  
  console.log(`Returning ${products.length} products after processing query`);
  
  // Create a valid Firestore-like response
  return {
    docs: products.map(product => ({
      id: product.id,
      data: () => product,
      exists: () => true
    })),
    forEach: function(callback) {
      this.docs.forEach(callback);
    },
    empty: products.length === 0,
    size: products.length
  };
};

export const where = (field, operator, value) => ({
  type: 'where',
  field,
  operator,
  value
});

export const limit = (limitCount) => ({
  type: 'limit',
  value: limitCount
});

// Mock implementation for Firebase services
class MockFirestore {
  type = 'firestore';
  
  constructor() {
    console.log('MockFirestore initialized with these collections:', Object.keys(mockData));
  }
  
  // For debugging
  toJSON() { 
    return 'MockFirestore'; 
  }
  
  // Add this helper method to get a collection by name
  collection(collectionPath) {
    console.log(`MockFirestore.collection called with: ${collectionPath}`);
    return {
      id: collectionPath,
      path: collectionPath,
      type: 'collection'
    };
  }
  
  // Mock document reference method
  doc(collectionPath, docId) {
    console.log(`MockFirestore.doc called with: ${collectionPath}, ${docId}`);
    return {
      id: docId,
      path: `${collectionPath}/${docId}`,
      type: 'document',
      // Get document data
      async get() {
        const collection = mockData[collectionPath] || [];
        const doc = collection.find(item => item.id === docId);
        
        return {
          exists: () => !!doc,
          data: () => doc || null,
          id: docId
        };
      }
    };
  }
}

// At the end of the file, export the db instance with debugging
console.log('Creating mock Firestore database...');
export const db = new MockFirestore() as any; // Use type assertion to bypass type checking
export const auth = {} as any; // Mock auth service 
export const storage = {} as any; // Mock storage service
console.log('Mock Firestore database created and exported.');

// Update Firestore function exports to use proper types
export const getDoc = async (docRef: any) => {
  const result = await docRef.get();
  return {
    exists: (): boolean => result.exists(),
    data: (): any => result.data()
  };
};

export const updateDoc = async (docRef: any, data: any) => {
  return docRef.update(data);
};

export const setDoc = async (docRef: any, data: any, options: any = {}) => {
  return docRef.set(data, options);
};

// Create a proper mock doc function that doesn't require a Firestore instance
export const doc = (db, collectionPath, docId) => {
  console.log(`doc() called with: collectionPath=${collectionPath}, docId=${docId}`);
  
  // If db has a doc method, use it directly
  if (db && typeof db.doc === 'function') {
    console.log('Using db.doc() method directly');
    return db.doc(collectionPath, docId);
  }
  
  // Otherwise use mock implementation
  console.log('Using generic mock doc implementation');
  return {
    id: docId,
    path: `${collectionPath}/${docId}`,
    type: 'document',
    // Get document data
    async get() {
      const collection = mockData[collectionPath] || [];
      const doc = collection.find(item => item.id === docId);
      
      return {
        exists: () => !!doc,
        data: () => doc || null,
        id: docId
      };
    }
  };
};

export const serverTimestamp = () => new Date().toISOString();

// Also export Firebase types for components that need them
export const Timestamp = {
  now: () => ({ toDate: () => new Date() }),
  fromDate: (date: Date) => ({ toDate: () => date })
};

export const query = (collectionRef, ...queryConstraints) => {
  console.log('Creating query with constraints:', queryConstraints);
  return {
    ...collectionRef,
    _queryConstraints: queryConstraints
  };
};

// Make sure the mock data is exported for direct use
export { mockData };