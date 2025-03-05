import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Keep imports but comment out Firebase imports
/*
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  getAuth
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
*/
// import { User } from '@/types';
import { mockData } from '@/lib/firebase-mock-data';

// Mock Firebase User type
interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface UserData {
  id: string;
  email: string | null;
  displayName?: string;
  role: string;
  favorites: string[];
  orderHistory: string[];
  [key: string]: any;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Define a type for the demo users object to help TypeScript
interface DemoUsers {
  [email: string]: {
    password: string;
    userData: UserData;
  };
}

// Get users from mock data
const mockUsers = mockData.users;

// Populate DEMO_USERS from mockData
const DEMO_USERS: DemoUsers = {};

// Set a default password for all mock users
mockUsers.forEach(user => {
  DEMO_USERS[user.email] = {
    password: 'password123',
    userData: { ...user }
  };
});

// Make sure we have all required user types for testing
console.log('Available demo users:', Object.keys(DEMO_USERS));

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a stored user in localStorage
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        
        // Find user data for the stored user
        const matchingUserData = mockUsers.find(user => user.id === parsedUser.uid);
        if (matchingUserData) {
          setUserData(matchingUserData);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('mockUser');
      }
    }
    
    setLoading(false);
    
    // Return mock cleanup function
    return () => {
      // Cleanup
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock sign in
    if (DEMO_USERS[email] && DEMO_USERS[email].password === password) {
      const userDataFromMock = DEMO_USERS[email].userData;
      
      const mockUser = {
        uid: userDataFromMock.id,
        email: email,
        displayName: userDataFromMock.displayName || null
      };
      
      setCurrentUser(mockUser);
      setUserData(userDataFromMock);
      
      // Save to localStorage to persist session
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Invalid email or password'));
    }
    
    /* Original Firebase code:
    await signInWithEmailAndPassword(auth, email, password);
    */
  };

  const signUp = async (email: string, password: string, role = 'customer') => {
    // Mock sign up
    if (DEMO_USERS[email]) {
      return Promise.reject(new Error('Email already in use'));
    }
    
    const newUserId = `user_${Date.now()}`;
    const newUserData = {
      id: newUserId,
      email: email,
      displayName: email.split('@')[0],
      role,
      favorites: [],
      orderHistory: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    // Add to our demo users (this will be lost on page refresh, but that's expected for a static demo)
    DEMO_USERS[email] = {
      password: password,
      userData: newUserData
    };
    
    // Auto login the new user
    const mockUser = {
      uid: newUserId,
      email: email,
      displayName: newUserData.displayName
    };
    
    setCurrentUser(mockUser);
    setUserData(newUserData);
    
    // Save to localStorage
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    
    return Promise.resolve();
    
    /* Original Firebase code:
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      email: user.email,
      role,
      favorites: [],
      orderHistory: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    */
  };

  const signOut = async () => {
    // Mock sign out
    setCurrentUser(null);
    setUserData(null);
    localStorage.removeItem('mockUser');
    return Promise.resolve();
    
    /* Original Firebase code:
    await firebaseSignOut(auth);
    */
  };

  const resetPassword = async (email: string) => {
    // Mock password reset - just log to console
    console.log(`Password reset email sent to ${email} (mock)`);
    return Promise.resolve();
    
    /* Original Firebase code:
    await sendPasswordResetEmail(auth, email);
    */
  };

  const value = {
    currentUser,
    userData,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}