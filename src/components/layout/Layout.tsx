import { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

const protectedRoutes = [
  '/account',
  '/checkout',
  '/admin',
  '/delivery',
];

const adminRoutes = [
  '/admin',
];

const driverRoutes = [
  '/delivery',
];

const homebaseRoutes = [
  '/homebase',
];

export default function Layout({ children }: LayoutProps) {
  const { currentUser, userData, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    if (loading) return;

    // Check if route requires authentication
    const requiresAuth = protectedRoutes.some(route => router.pathname.startsWith(route));
    
    // Check if user is authorized for this route
    if (requiresAuth && !currentUser) {
      router.push('/login?redirect=' + router.pathname);
      setIsAuthorized(false);
    } else if (
      // Check admin routes
      adminRoutes.some(route => router.pathname.startsWith(route)) && 
      userData?.role !== 'admin'
    ) {
      router.push('/');
      setIsAuthorized(false);
    } else if (
      // Check driver routes
      driverRoutes.some(route => router.pathname.startsWith(route)) && 
      userData?.role !== 'driver'
    ) {
      router.push('/');
      setIsAuthorized(false);
    } else if (
      // Check homebase routes
      homebaseRoutes.some(route => router.pathname.startsWith(route)) && 
      userData?.role !== 'homebase'
    ) {
      router.push('/');
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, [currentUser, userData, loading, router]);

  return (
    <>
      <Head>
        <title>Hempnotyx - Premium Cannabis Products</title>
        <meta name="description" content="Browse our selection of premium cannabis products" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-full py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : isAuthorized ? (
            children
          ) : null}
        </main>
        
        <Footer />
      </div>
    </>
  );
}