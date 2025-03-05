import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

export default function DeliveryDashboard() {
  const { userData, currentUser } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'assigned' | 'completed'>('assigned');
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);

  useEffect(() => {
    if (userData && userData.role !== 'driver') {
      router.push('/');
      return;
    }

    const fetchOrders = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        const assignedOrdersQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', currentUser.uid),
          where('status', 'in', ['ready', 'out_for_delivery']),
          orderBy('createdAt', 'desc')
        );
        
        const completedOrdersQuery = query(
          collection(db, 'orders'),
          where('driverId', '==', currentUser.uid),
          where('status', 'in', ['delivered', 'completed']),
          orderBy('createdAt', 'desc')
        );
        
        const queryToUse = activeTab === 'assigned' ? assignedOrdersQuery : completedOrdersQuery;
        const snapshot = await getDocs(queryToUse);
        
        const ordersList: Order[] = [];
        snapshot.forEach((doc) => {
          ordersList.push({ id: doc.id, ...doc.data() } as Order);
        });
        
        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userData, router, currentUser, activeTab]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!currentUser) return;
    
    try {
      setProcessingOrder(orderId);
      
      const orderRef = doc(db, 'orders', orderId);
      const timestamp = Date.now();
      
      const updateData: Record<string, any> = {
        status: newStatus,
      };
      
      // Add timestamp for the specific status
      if (newStatus === 'out_for_delivery') {
        updateData.orderPickedUpByDriver = timestamp;
      } else if (newStatus === 'delivered') {
        updateData.orderDelivered = timestamp;
      }
      
      await updateDoc(orderRef, updateData);
      
      // Refresh orders
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return { 
            ...order, 
            status: newStatus as Order['status'],
            ...(newStatus === 'out_for_delivery' ? { orderPickedUpByDriver: timestamp } : {}),
            ...(newStatus === 'delivered' ? { orderDelivered: timestamp } : {})
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleStartDelivery = (orderId: string) => {
    updateOrderStatus(orderId, 'out_for_delivery');
  };

  const handleCompleteDelivery = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered');
  };

  const handleIDVerification = async (orderId: string, isVerified: boolean) => {
    if (!currentUser) return;
    
    try {
      setProcessingOrder(orderId);
      
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        idVerified: isVerified
      });
      
      // Update local state
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return { ...order, idVerified: isVerified };
        }
        return order;
      });
      
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating ID verification:', error);
    } finally {
      setProcessingOrder(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Driver Portal</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('assigned')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assigned'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Assigned Orders
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`whitespace-nowrap ml-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed Orders
            </button>
          </nav>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-lg font-medium text-gray-900">
                      Order #{order.id.slice(0, 8)}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'ready' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' : 
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                      
                      {order.idVerified && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ID Verified
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex flex-col space-y-2">
                      <Link 
                        href={`/delivery/orders/${order.id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View Details
                      </Link>
                      
                      {order.status === 'ready' && (
                        <button
                          onClick={() => handleStartDelivery(order.id)}
                          disabled={processingOrder === order.id}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          {processingOrder === order.id ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                              Processing...
                            </div>
                          ) : (
                            'Start Delivery'
                          )}
                        </button>
                      )}
                      
                      {order.status === 'out_for_delivery' && (
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleCompleteDelivery(order.id)}
                            disabled={processingOrder === order.id || !order.idVerified}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                              order.idVerified 
                                ? 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500' 
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {processingOrder === order.id ? (
                              <div className="flex items-center">
                                <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                Processing...
                              </div>
                            ) : (
                              'Complete Delivery'
                            )}
                          </button>
                          
                          {!order.idVerified && (
                            <button
                              onClick={() => handleIDVerification(order.id, true)}
                              disabled={processingOrder === order.id}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              {processingOrder === order.id ? (
                                <div className="flex items-center">
                                  <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                  Processing...
                                </div>
                              ) : (
                                'Verify ID'
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zip}
                    {order.deliveryAddress?.unit && ` Unit ${order.deliveryAddress.unit}`}
                  </div>
                  
                  {order.deliveryAddress?.notes && (
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Delivery Notes:</span> {order.deliveryAddress.notes}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-900">Order Summary</h3>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <li key={item.productId} className="py-2 flex justify-between">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">{item.quantity}x</span>
                          <span className="ml-2 text-sm text-gray-900">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex justify-between">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-base font-medium text-green-600">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          <h2 className="mt-4 text-lg font-medium text-gray-900">
            {activeTab === 'assigned' 
              ? 'No assigned deliveries'
              : 'No completed deliveries'
            }
          </h2>
          <p className="mt-2 text-gray-500">
            {activeTab === 'assigned' 
              ? 'When you are assigned deliveries, they will appear here.'
              : 'Your completed deliveries will be shown here.'
            }
          </p>
        </div>
      )}
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Scan ID for Verification</h2>
        <p className="text-gray-500 mb-4">
          Use your device's camera to scan the customer's ID for age verification.
        </p>
        <Link 
          href="/delivery/scan"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Open Scanner
        </Link>
      </div>
    </div>
  );
}