export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'customer' | 'admin' | 'driver' | 'homebase';
  phone?: string;
  address?: Address;
  favorites: string[];
  orderHistory: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  salePrice?: number;
  strain?: 'sativa' | 'indica' | 'hybrid' | 'cbd';
  thcContent?: number;
  cbdContent?: number;
  images: string[];
  inStock: boolean;
  stockCount: number;
  barcode?: string;
  coaUrl?: string; // Certificate of Analysis PDF link
  tags: string[];
  featured: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  updatedAt: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cash' | 'card' | 'online';
  fulfillmentMethod: 'pickup' | 'delivery';
  deliveryAddress?: Address;
  deliveryFee?: number;
  driverId?: string;
  scheduledFor?: number; // timestamp
  orderReceived?: number; // timestamp
  orderProcessing?: number; // timestamp
  orderReady?: number; // timestamp
  orderPickedUpByDriver?: number; // timestamp
  orderDelivered?: number; // timestamp
  idVerified: boolean;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export type OrderStatus = 
  | 'received' 
  | 'processing' 
  | 'ready' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'completed' 
  | 'cancelled';

export interface COA {
  id: string;
  productId: string;
  batchNumber: string;
  testDate: number;
  expirationDate: number;
  labName: string;
  fileUrl: string;
  thcContent: number;
  cbdContent: number;
  createdAt: number;
}

export interface InventoryUpdate {
  id: string;
  productId: string;
  previousCount: number;
  newCount: number;
  reason: string;
  adminId: string;
  createdAt: number;
}