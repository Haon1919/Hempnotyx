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

// Type definitions for mock data
export interface MockProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  salePrice: number | null;
  strain: string | null;
  thcContent: number;
  cbdContent: number;
  inStock: boolean;
  stockCount: number;
  images: string[];
  barcode: string;
  coaUrl: string | null;
  tags: string[];
  featured: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface MockUser {
  id: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin' | 'driver' | 'homebase';
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    notes?: string;
  };
  favorites: string[];
  orderHistory: string[];
  createdAt: number;
  updatedAt: number;
}

export interface MockData {
  products: MockProduct[];
  users: MockUser[];
  orders: any[]; // Can expand this if needed
  carts?: any[];
  deliveries?: any[];
  inventory?: any[];
}

// Mock Firestore class
class FirestoreDB {
  type: string = 'firestore';
  toJSON(): string { return 'Firestore'; }
}

// Mock collection data
const mockData: MockData = {
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
    // Add more products here
    { 
      id: 'cbd-oil-1', 
      name: 'Full Spectrum CBD Oil 1000mg', 
      description: 'Our premium CBD oil contains a full spectrum of cannabinoids for maximum effectiveness.',
      category: 'CBD Oils',
      subcategory: 'Full Spectrum',
      price: 69.99,
      salePrice: 59.99,
      strain: null,
      thcContent: 0.1,
      cbdContent: 1000,
      inStock: true,
      stockCount: 35,
      images: ['/images/products/cbd-oil-1.jpg', '/images/products/cbd-oil-1-detail.jpg'],
      barcode: 'CB10056789',
      coaUrl: '/coa/cbd-oil-1.pdf',
      tags: ['premium', 'cbd oil', 'full spectrum', 'tincture'],
      featured: true,
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000
    },
    { 
      id: 'gummies-1', 
      name: 'CBD Gummies 25mg', 
      description: 'Delicious fruit-flavored gummies with 25mg of CBD per piece.',
      category: 'Edibles',
      subcategory: 'Gummies',
      price: 24.99,
      salePrice: null,
      strain: null,
      thcContent: 0,
      cbdContent: 25,
      inStock: true,
      stockCount: 100,
      images: ['/images/products/gummies-1.jpg'],
      barcode: 'ED10034567',
      coaUrl: '/coa/gummies-1.pdf',
      tags: ['edibles', 'gummies', 'cbd', 'fruit flavor'],
      featured: false,
      createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000
    }
  ],
  users: [
    // ... your mock users data
  ],
  orders: [
    // ... your mock orders data
  ]
};

// Mock document interfaces
export interface MockDocumentSnapshot {
  id: string;
  exists: () => boolean;
  data: () => any | null;
}

export interface MockQuerySnapshot {
  docs: MockDocumentSnapshot[];
  forEach: (callback: (doc: MockDocumentSnapshot) => void) => void;
  empty: boolean;
  size: number;
}

export interface MockDocumentReference {
  id: string;
  path: string;
  type: string;
  get: () => Promise<MockDocumentSnapshot>;
}

export interface MockCollectionReference {
  id: string;
  path: string;
  type: string;
}

export interface MockQueryConstraint {
  type: string;
  field?: string;
  direction?: 'asc' | 'desc';
  operator?: string;
  value?: any;
}

// Mock Firestore function types
export const collection = (db: any, collectionName: string): MockCollectionReference => {
  console.log(`collection() called with: collectionName=${collectionName}`);
  return {
    id: collectionName,
    path: collectionName,
    type: 'collection'
  };
};

export const getDocs = async (querySnapshot: any): Promise<MockQuerySnapshot> => {
  console.log('getDocs called with query:', querySnapshot);
  
  // Determine which collection was queried
  let collectionName = 'products'; // Default to products
  
  if (querySnapshot && querySnapshot.path) {
    collectionName = querySnapshot.path;
    console.log(`Using path from querySnapshot: ${collectionName}`);
  }
  
  // Get the mock products
  const products = [...(mockData[collectionName as keyof MockData] || [])];
  console.log(`Found ${products.length} products in mock data`);
  
  // Log some sample timestamps to verify the format
  if (products.length > 0) {
    console.log('Sample product timestamp:', products[0].createdAt, 'type:', typeof products[0].createdAt);
  }
  
  // Apply any query constraints if they exist
  if (querySnapshot && querySnapshot._queryConstraints && querySnapshot._queryConstraints.length > 0) {
    console.log('Applying query constraints...');
    
    // Look for orderBy constraints
    const orderByConstraints = querySnapshot._queryConstraints.filter((c: MockQueryConstraint) => c.type === 'orderBy');
    if (orderByConstraints.length > 0) {
      console.log('Found orderBy constraints:', orderByConstraints);
      
      // Apply the first orderBy constraint
      const { field, direction } = orderByConstraints[0];
      console.log(`Sorting by ${field} ${direction}`);
      
      products.sort((a: any, b: any) => {
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
  
  // Create document snapshots
  const docSnapshots = products.map(product => ({
    id: product.id,
    data: () => product,
    exists: () => true
  }));
  
  // Create a valid Firestore-like response
  const response: MockQuerySnapshot = {
    docs: docSnapshots,
    forEach: (callback: (doc: MockDocumentSnapshot) => void) => {
      docSnapshots.forEach(callback);
    },
    empty: products.length === 0,
    size: products.length
  };
  
  return response;
};

export const where = (field: string, operator: string, value: any): MockQueryConstraint => ({
  type: 'where',
  field,
  operator,
  value
});

export const limit = (limitCount: number): MockQueryConstraint => ({
  type: 'limit',
  value: limitCount
});

export const orderBy = (field: string, direction: 'asc' | 'desc' = 'asc'): MockQueryConstraint => ({
  type: 'orderBy',
  field,
  direction
});

// Mock implementation for Firebase services
class MockFirestore {
  type: string = 'firestore';
  
  constructor() {
    console.log('MockFirestore initialized with these collections:', Object.keys(mockData));
  }
  
  // For debugging
  toJSON(): string { 
    return 'MockFirestore'; 
  }
  
  // Add this helper method to get a collection by name
  collection(collectionPath: string): MockCollectionReference {
    console.log(`MockFirestore.collection called with: ${collectionPath}`);
    return {
      id: collectionPath,
      path: collectionPath,
      type: 'collection'
    };
  }
  
  // Mock document reference method
  doc(collectionPath: string, docId: string): MockDocumentReference {
    console.log(`MockFirestore.doc called with: ${collectionPath}, ${docId}`);
    return {
      id: docId,
      path: `${collectionPath}/${docId}`,
      type: 'document',
      // Get document data
      async get(): Promise<MockDocumentSnapshot> {
        const collection = mockData[collectionPath as keyof MockData] || [];
        const doc = (collection as any[]).find(item => item.id === docId);
        
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
export const db = new MockFirestore() as any; // Use type assertion for compatibility
export const auth = {} as any; // Mock auth service 
export const storage = {} as any; // Mock storage service
console.log('Mock Firestore database created and exported.');

// Update Firestore function exports to use proper types
export const getDoc = async (docRef: MockDocumentReference): Promise<MockDocumentSnapshot> => {
  const result = await docRef.get();
  return {
    exists: (): boolean => result.exists(),
    data: (): any => result.data(),
    id: docRef.id
  };
};

export const updateDoc = async (docRef: MockDocumentReference, data: any): Promise<void> => {
  return Promise.resolve();
};

export const setDoc = async (docRef: MockDocumentReference, data: any, options: any = {}): Promise<void> => {
  return Promise.resolve();
};

// Create a proper mock doc function that doesn't require a Firestore instance
export const doc = (db: any, collectionPath: string, docId: string): MockDocumentReference => {
  console.log(`doc() called with: collectionPath=${collectionPath}, docId=${docId}`);
  
  // If db has a doc method, use it directly
  if (db && typeof db.doc === 'function') {
    console.log('Using db.doc() method directly');
    return db.doc(collectionPath, docId);
  }
  
  // Otherwise use generic mock implementation
  console.log('Using generic mock doc implementation');
  return {
    id: docId,
    path: `${collectionPath}/${docId}`,
    type: 'document',
    // Get document data
    async get(): Promise<MockDocumentSnapshot> {
      const collection = mockData[collectionPath as keyof MockData] || [];
      const doc = (collection as any[]).find(item => item.id === docId);
      
      return {
        exists: () => !!doc,
        data: () => doc || null,
        id: docId
      };
    }
  };
};

export const serverTimestamp = (): string => new Date().toISOString();

// Also export Firebase types for components that need them
export const Timestamp = {
  now: () => ({ toDate: () => new Date() }),
  fromDate: (date: Date) => ({ toDate: () => date })
};

export const query = (collectionRef: MockCollectionReference, ...queryConstraints: MockQueryConstraint[]): any => {
  console.log('Creating query with constraints:', queryConstraints);
  return {
    ...collectionRef,
    _queryConstraints: queryConstraints
  };
};

// Make sure the mock data is exported for direct use
export { mockData };