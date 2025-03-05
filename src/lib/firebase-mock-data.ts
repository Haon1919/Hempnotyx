// Mock data for Firebase
export const mockData = {
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
      cbdContent: 20.1,
      inStock: true,
      stockCount: 35,
      images: ['/images/products/hemp-flower-2.jpg', '/images/products/hemp-flower-2-detail.jpg'],
      barcode: 'HF10054321',
      coaUrl: '/coa/hemp-flower-2.pdf',
      tags: ['hemp flower', 'sativa', 'energy', 'focus'],
      featured: true,
      createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
      updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000 // 10 days ago
    },
    { 
      id: 'cbd-oil-1', 
      name: 'Full Spectrum CBD Oil 1000mg', 
      description: 'High-potency full-spectrum CBD oil with all beneficial cannabinoids and terpenes intact. Perfect for experienced users seeking maximum benefit.',
      category: 'CBD Oils',
      subcategory: 'Full Spectrum',
      price: 89.99,
      salePrice: null,
      strain: null,
      thcContent: 0.3,
      cbdContent: 1000,
      inStock: true,
      stockCount: 25,
      images: ['/images/products/cbd-oil-1.jpg', '/images/products/cbd-oil-1-detail.jpg'],
      barcode: 'CO10067890',
      coaUrl: '/coa/cbd-oil-1.pdf',
      tags: ['cbd oil', 'full spectrum', 'tincture', 'wellness'],
      featured: true,
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
      updatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000 // 15 days ago
    },
    { 
      id: 'cbd-gummies-1', 
      name: 'CBD Gummies 25mg', 
      description: 'Delicious fruit-flavored CBD gummies with 25mg of CBD per piece. A tasty way to get your daily dose of CBD.',
      category: 'Edibles',
      subcategory: 'Gummies',
      price: 34.99,
      salePrice: 29.99,
      strain: null,
      thcContent: 0,
      cbdContent: 25,
      inStock: true,
      stockCount: 100,
      images: ['/images/products/gummies-1.jpg', '/images/products/gummies-1-detail.jpg'],
      barcode: 'GU10098765',
      coaUrl: '/coa/gummies-1.pdf',
      tags: ['edibles', 'gummies', 'cbd', 'tasty'],
      featured: true,
      createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000, // 40 days ago
      updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days ago
    },
    { 
      id: 'topical-1', 
      name: 'CBD Muscle Relief Cream', 
      description: 'Soothing CBD-infused cream with menthol and arnica for fast muscle pain relief. Perfect for post-workout recovery.',
      category: 'Topicals',
      subcategory: 'Creams',
      price: 45.99,
      salePrice: null,
      strain: null,
      thcContent: 0,
      cbdContent: 500,
      inStock: true,
      stockCount: 30,
      images: ['/images/products/topical-1.jpg', '/images/products/topical-1-detail.jpg'],
      barcode: 'TP10023456',
      coaUrl: '/coa/topical-1.pdf',
      tags: ['topical', 'cream', 'muscle relief', 'menthol'],
      featured: false,
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  
  // Added distinct user types required for testing
  users: [
    {
      id: 'user123',
      email: 'user@example.com',
      displayName: 'Regular User',
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
      orderHistory: ['order1', 'order3'],
      createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000
    },
    {
      id: 'admin123',
      email: 'admin@example.com',
      displayName: 'Admin User',
      role: 'admin',
      phone: '555-987-6543',
      address: {
        street: '456 Admin Ave',
        city: 'Portland',
        state: 'OR',
        zip: '97202'
      },
      favorites: [],
      orderHistory: [],
      createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'driver123',
      email: 'driver@example.com',
      displayName: 'Delivery Driver',
      role: 'driver',
      phone: '555-456-7890',
      address: {
        street: '789 Driver Rd',
        city: 'Portland',
        state: 'OR',
        zip: '97203'
      },
      favorites: [],
      orderHistory: [],
      activeDeliveries: ['order2'],
      completedDeliveries: ['order1'],
      createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000
    },
    {
      id: 'homebase123',
      email: 'homebase@example.com',
      displayName: 'Homebase Staff',
      role: 'homebase',
      phone: '555-789-0123',
      address: {
        street: '101 Warehouse Blvd',
        city: 'Portland',
        state: 'OR',
        zip: '97204'
      },
      favorites: [],
      orderHistory: [],
      ordersProcessed: ['order1', 'order2'],
      createdAt: Date.now() - 75 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 20 * 24 * 60 * 60 * 1000
    }
  ],
  
  // Enhanced orders for testing delivery and homebase functionality
  orders: [
    {
      id: 'order1',
      userId: 'user123',
      userEmail: 'user@example.com',
      userName: 'Regular User',
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
          price: 89.99,
          name: 'Full Spectrum CBD Oil 1000mg',
          image: '/images/products/cbd-oil-1.jpg'
        }
      ],
      subtotal: 149.97,
      tax: 15.00,
      total: 164.97,
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
      driverId: 'driver123',
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
      userId: 'user123',
      userEmail: 'user@example.com',
      userName: 'Regular User',
      items: [
        {
          productId: 'cbd-gummies-1',
          quantity: 1,
          price: 34.99,
          name: 'CBD Gummies 25mg',
          image: '/images/products/gummies-1.jpg'
        }
      ],
      subtotal: 34.99,
      tax: 3.50,
      total: 38.49,
      status: 'out-for-delivery',
      paymentStatus: 'paid',
      paymentMethod: 'online',
      fulfillmentMethod: 'delivery',
      deliveryAddress: {
        street: '123 Main St',
        city: 'Portland',
        state: 'OR',
        zip: '97201',
        notes: 'Front door code: 1234'
      },
      deliveryFee: 5.00,
      driverId: 'driver123',
      scheduledFor: Date.now() + 1 * 24 * 60 * 60 * 1000,
      orderReceived: Date.now() - 2 * 24 * 60 * 60 * 1000,
      orderProcessing: Date.now() - 1 * 24 * 60 * 60 * 1000,
      orderReady: Date.now() - 12 * 60 * 60 * 1000,
      orderPickedUpByDriver: Date.now() - 6 * 60 * 60 * 1000,
      orderDelivered: null,
      idVerified: false,
      notes: '',
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 6 * 60 * 60 * 1000
    },
    {
      id: 'order3',
      userId: 'user123',
      userEmail: 'user@example.com',
      userName: 'Regular User',
      items: [
        {
          productId: 'topical-1',
          quantity: 1,
          price: 45.99,
          name: 'CBD Muscle Relief Cream',
          image: '/images/products/topical-1.jpg'
        }
      ],
      subtotal: 45.99,
      tax: 4.60,
      total: 50.59,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      fulfillmentMethod: 'pickup',
      scheduledFor: Date.now() + 3 * 24 * 60 * 60 * 1000,
      orderReceived: Date.now() - 4 * 60 * 60 * 1000,
      orderProcessing: Date.now() - 2 * 60 * 60 * 1000,
      orderReady: null,
      idVerified: false,
      notes: 'Call when ready for pickup',
      createdAt: Date.now() - 4 * 60 * 60 * 1000,
      updatedAt: Date.now() - 2 * 60 * 60 * 1000
    },
    {
      id: 'order4',
      userId: 'user123',
      userEmail: 'user@example.com',
      userName: 'Regular User',
      items: [
        {
          productId: 'hemp-flower-2',
          quantity: 1,
          price: 24.99,
          salePrice: 19.99,
          name: 'Sour Space Candy',
          image: '/images/products/hemp-flower-2.jpg'
        }
      ],
      subtotal: 19.99,
      tax: 2.00,
      total: 21.99,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: null,
      fulfillmentMethod: 'delivery',
      deliveryAddress: {
        street: '123 Main St',
        city: 'Portland',
        state: 'OR',
        zip: '97201',
        notes: 'Front door code: 1234'
      },
      deliveryFee: 5.00,
      driverId: null,
      scheduledFor: null,
      orderReceived: Date.now(),
      orderProcessing: null,
      orderReady: null,
      orderPickedUpByDriver: null,
      orderDelivered: null,
      idVerified: false,
      notes: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ],
  
  // Add cart data for testing cart functionality
  carts: [
    {
      id: 'cart-user123',
      userId: 'user123',
      items: [
        {
          productId: 'hemp-flower-2',
          quantity: 1,
          price: 19.99, // Sale price
          name: 'Sour Space Candy',
          image: '/images/products/hemp-flower-2.jpg'
        }
      ],
      subtotal: 19.99,
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 2 * 60 * 60 * 1000
    }
  ],
  
  // Add delivery data for testing delivery functionality
  deliveries: [
    {
      id: 'delivery1',
      orderId: 'order1',
      driverId: 'driver123',
      status: 'completed',
      scheduledFor: Date.now() - 10 * 24 * 60 * 60 * 1000,
      completedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      customerSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      idVerified: true,
      notes: 'Delivered successfully',
      customerAddress: {
        street: '123 Main St',
        city: 'Portland',
        state: 'OR',
        zip: '97201',
        notes: 'Front door code: 1234'
      },
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000
    },
    {
      id: 'delivery2',
      orderId: 'order2',
      driverId: 'driver123',
      status: 'in-progress',
      scheduledFor: Date.now() + 1 * 24 * 60 * 60 * 1000,
      completedAt: null,
      customerSignature: null,
      idVerified: false,
      notes: '',
      customerAddress: {
        street: '123 Main St',
        city: 'Portland',
        state: 'OR',
        zip: '97201',
        notes: 'Front door code: 1234'
      },
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 6 * 60 * 60 * 1000
    }
  ],
  
  // Add homebase inventory data for testing homebase functionality
  inventory: [
    {
      id: 'inv-hemp-flower-1',
      productId: 'hemp-flower-1',
      stockCount: 50,
      lowStockThreshold: 10,
      reorderPoint: 20,
      locationCode: 'A1-B2-C3',
      supplierInfo: {
        name: 'Premium Hemp Farms',
        contactEmail: 'orders@premiumhempfarms.com',
        contactPhone: '555-111-2222'
      },
      lastRestocked: Date.now() - 30 * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000
    },
    {
      id: 'inv-hemp-flower-2',
      productId: 'hemp-flower-2',
      stockCount: 35,
      lowStockThreshold: 10,
      reorderPoint: 20,
      locationCode: 'A1-B2-C4',
      supplierInfo: {
        name: 'Premium Hemp Farms',
        contactEmail: 'orders@premiumhempfarms.com',
        contactPhone: '555-111-2222'
      },
      lastRestocked: Date.now() - 45 * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 45 * 24 * 60 * 60 * 1000
    },
    {
      id: 'inv-cbd-oil-1',
      productId: 'cbd-oil-1',
      stockCount: 25,
      lowStockThreshold: 5,
      reorderPoint: 10,
      locationCode: 'B3-C1-D2',
      supplierInfo: {
        name: 'CBD Extracts Co.',
        contactEmail: 'wholesale@cbdextracts.com',
        contactPhone: '555-333-4444'
      },
      lastRestocked: Date.now() - 60 * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 60 * 24 * 60 * 60 * 1000
    },
    {
      id: 'inv-cbd-gummies-1',
      productId: 'cbd-gummies-1',
      stockCount: 100,
      lowStockThreshold: 20,
      reorderPoint: 40,
      locationCode: 'C2-D1-E3',
      supplierInfo: {
        name: 'Sweet Hemp Edibles',
        contactEmail: 'orders@sweethempedibles.com',
        contactPhone: '555-555-6666'
      },
      lastRestocked: Date.now() - 40 * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 150 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 40 * 24 * 60 * 60 * 1000
    },
    {
      id: 'inv-topical-1',
      productId: 'topical-1',
      stockCount: 30,
      lowStockThreshold: 8,
      reorderPoint: 15,
      locationCode: 'D4-E2-F1',
      supplierInfo: {
        name: 'Healing Hemp Topicals',
        contactEmail: 'sales@hemptopicals.com',
        contactPhone: '555-777-8888'
      },
      lastRestocked: Date.now() - 35 * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 160 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 35 * 24 * 60 * 60 * 1000
    }
  ]
};