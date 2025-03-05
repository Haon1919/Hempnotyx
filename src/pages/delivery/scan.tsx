import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// @ts-ignore
import QrReader from 'react-qr-scanner';
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function IDScanner() {
  const { userData } = useAuth();
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [verifiedOrder, setVerifiedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const scannerRef = useRef<any | null>(null);

  useEffect(() => {
    if (userData && userData.role !== 'driver') {
      router.push('/');
      return;
    }

    // Mock camera permission check
    setCameraPermission(true);

    return () => {
      if (scanning) {
        stopScanning();
      }
    };
  }, [userData, router, scanning]);

  const startScanning = () => {
    setScanning(true);
    setScannedData(null);
    setError(null);
    setVerificationStatus('pending');
    setVerifiedOrder(null);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const handleScan = (data: { text: string } | null) => {
    if (data && data.text) {
      setScannedData(data.text);
      stopScanning();
      processScannedData(data.text);
    }
  };

  const handleError = (err: Error) => {
    console.error('QR scanner error:', err);
    setError('Error scanning: ' + err.message);
    stopScanning();
  };

  const processScannedData = async (data: string) => {
    try {
      setLoading(true);
      
      // Parse the QR code data
      // For this example, let's assume the QR code contains: "ORDER_ID:CUSTOMER_ID"
      const [orderId, customerId] = data.split(':');
      
      if (!orderId || !customerId) {
        setError('Invalid QR code format');
        setVerificationStatus('failed');
        return;
      }
      
      // Verify the order exists and belongs to the customer
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      
      if (!orderDoc.exists()) {
        setError('Order not found');
        setVerificationStatus('failed');
        return;
      }
      
      const orderData = orderDoc.data();
      
      if (orderData.userId !== customerId) {
        setError('Order verification failed. Customer ID mismatch.');
        setVerificationStatus('failed');
        return;
      }
      
      // Mark the order as ID verified
      await updateDoc(doc(db, 'orders', orderId), {
        idVerified: true
      });
      
      setVerifiedOrder(orderId);
      setVerificationStatus('success');
    } catch (err: any) {
      console.error('Error processing scan:', err);
      setError('Verification failed: ' + err.message);
      setVerificationStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ID Scanner</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        {cameraError ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-4 text-lg font-medium text-gray-900">Camera Error</h2>
            <p className="mt-2 text-gray-500">{cameraError}</p>
            <Link href="/delivery" className="mt-4 inline-block text-green-600 hover:text-green-800">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            )}
            
            {!scanning && !scannedData && (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h2 className="mt-4 text-lg font-medium text-gray-900">Ready to Scan</h2>
                <p className="mt-2 text-gray-500">Click the button below to start scanning customer ID.</p>
                <button
                  onClick={startScanning}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Start Scanning
                </button>
              </div>
            )}
            
            {scanning && (
              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                  <QrReader
                    ref={scannerRef}
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                    constraints={{
                      audio: false,
                      video: { facingMode: 'environment' }
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-2 border-dashed border-white w-48 h-48 opacity-70"></div>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={stopScanning}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {(verificationStatus === 'success' &&
              <div className="mt-6 text-center">
                <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-4 text-lg font-medium text-gray-900">ID Verified Successfully</h2>
                <p className="mt-2 text-gray-500">
                  Order #{verifiedOrder?.slice(0, 8)} has been verified and is ready for delivery completion.
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                  <Link
                    href={`/delivery/orders/${verifiedOrder}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    View Order
                  </Link>
                  <Link
                    href="/delivery"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}