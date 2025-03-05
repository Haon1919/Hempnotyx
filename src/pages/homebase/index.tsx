import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Order, Product } from '@/types';

export default function HomeBaseDashboard() {
  const { userData } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const [refreshingInventory, setRefreshingInventory] = useState(false);

  useEffect(() => {
    if (userData && userData.role !== 'homebase') {
      router.push('/');
      return;
    }

    // Set up real-time listeners for orders
    const unsubscribeOrders = onSnapshot(
      query(
        collection(db, 'orders'),
        where('status', 'in', ['received', 'processing', 'ready']),
        orderBy('createdAt', 'asc')
      ),
      (snapshot) => {
        const ordersList: Order[] = [];
        snapshot.forEach((doc) => {
          ordersList.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(ordersList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    );

    // Load product data for efficient lookup
    const unsubscribeProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const productsMap: Record<string, Product> = {};
        snapshot.forEach((doc) => {
          productsMap[doc.id] = { id: doc.id, ...doc.data() } as Product;
        });
        setProducts(productsMap);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
    };
  }, [userData, router]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setProcessingOrder(orderId);
      
      const orderRef = doc(db, 'orders', orderId);
      const timestamp = Date.now();
      
      const updateData: Record<string, any> = {
        status: newStatus,
      };
      
      // Add timestamp for the specific status
      if (newStatus === 'processing') {
        updateData.orderProcessing = timestamp;
      } else if (newStatus === 'ready') {
        updateData.orderReady = timestamp;
      }
      
      await updateDoc(orderRef, updateData);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setProcessingOrder(null);
    }
  };

  const refreshInventory = async () => {
    try {
      setRefreshingInventory(true);
      
      // This would be a server-side function that checks all inventory against sales data
      // and updates stock levels. For now, we'll just simulate a delay.
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would have a cloud function that does this sync
      
    } catch (error) {
      console.error('Error refreshing inventory:', error);
    } finally {
      setRefreshingInventory(false);
    }
  };

  const checkStockForOrder = (order: Order): boolean => {
    // Check if all items in the order are in stock
    return order.items.every(item => {
      const product = products[item.productId];
      return product && product.inStock && product.stockCount >= item.quantity;
    });
  };

  // Group orders by status
  const newOrders = orders.filter(order => order.status === 'received');
  const processingOrders = orders.filter(order => order.status === 'processing');
  const readyOrders = orders.filter(order => order.status === 'ready');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Home Base Dashboard</h1>
        
        <button
          onClick={refreshInventory}
          disabled={refreshingInventory}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {refreshingInventory ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
              Syncing...
            </div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync Inventory
            </>
          )}
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* New Orders */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-500 px-4 py-3">
              <h2 className="text-lg font-medium text-white">New Orders ({newOrders.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {newOrders.length > 0 ? (
                newOrders.map((order) => {
                  const hasStock = checkStockForOrder(order);
                  
                  return (
                    <div key={order.id} className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            Order #{order.id.slice(0, 8)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.items.length} items · ${order.total.toFixed(2)}
                          </p>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.fulfillmentMethod === 'pickup' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {order.fulfillmentMethod === 'pickup' ? 'Pickup' : 'Delivery'}
                            </span>
                            
                            {!hasStock && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Stock Issue
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                          <Link
                            href={`/homebase/orders/${order.id}`}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            View Details
                          </Link>
                          
                          <button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            disabled={processingOrder === order.id || !hasStock}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white ${
                              hasStock 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {processingOrder === order.id ? (
                              <div className="flex items-center">
                                <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-1"></div>
                                Processing...
                              </div>
                            ) : (
                              'Start Processing'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No new orders</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Processing Orders */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-yellow-500 px-4 py-3">
              <h2 className="text-lg font-medium text-white">Processing ({processingOrders.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {processingOrders.length > 0 ? (
                processingOrders.map((order) => (
                  <div key={order.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} items · ${order.total.toFixed(2)}
                        </p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.fulfillmentMethod === 'pickup' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {order.fulfillmentMethod === 'pickup' ? 'Pickup' : 'Delivery'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                        <Link
                          href={`/homebase/orders/${order.id}`}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                        
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          disabled={processingOrder === order.id}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          {processingOrder === order.id ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-1"></div>
                              Updating...
                            </div>
                          ) : (
                            'Mark Ready'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No orders in processing</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Ready Orders */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-500 px-4 py-3">
              <h2 className="text-lg font-medium text-white">Ready for Pickup/Delivery ({readyOrders.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {readyOrders.length > 0 ? (
                readyOrders.map((order) => (
                  <div key={order.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} items · ${order.total.toFixed(2)}
                        </p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.fulfillmentMethod === 'pickup' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {order.fulfillmentMethod === 'pickup' ? 'Pickup' : 'Delivery'}
                          </span>
                          
                          {order.driverId && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Driver Assigned
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex flex-col space-y-2">
                        <Link
                          href={`/homebase/orders/${order.id}`}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                        
                        {order.fulfillmentMethod === 'pickup' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            disabled={processingOrder === order.id}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            {processingOrder === order.id ? (
                              <div className="flex items-center">
                                <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-1"></div>
                                Updating...
                              </div>
                            ) : (
                              'Complete Pickup'
                            )}
                          </button>
                        )}
                        
                        {order.fulfillmentMethod === 'delivery' && !order.driverId && (
                          <Link
                            href={`/homebase/assign-driver/${order.id}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            Assign Driver
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No orders ready for pickup/delivery</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Order Summary */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Today's Summary</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Total Orders</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{orders.length}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Pickups</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {orders.filter(order => order.fulfillmentMethod === 'pickup').length}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Deliveries</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {orders.filter(order => order.fulfillmentMethod === 'delivery').length}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Revenue</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">
                ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-md rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="ml-3 text-lg font-medium text-gray-900">All Orders</h3>
            </div>
            <div className="mt-4">
              <Link
                href="/homebase/orders"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                View All Orders
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow-md rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Inventory</h3>
            </div>
            <div className="mt-4">
              <Link
                href="/homebase/inventory"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
              >
                Manage Inventory
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow-md rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Drivers</h3>
            </div>
            <div className="mt-4">
              <Link
                href="/homebase/drivers"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
              >
                Manage Drivers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}