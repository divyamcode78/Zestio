import { 
  auth, 
  db, 
  storage 
} from './firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

// Authentication Services
export const authService = {
  // Email/Password Authentication
  signUp: async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  },

  signIn: async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  signOut: async () => {
    return await signOut(auth);
  },

  // Google Authentication
  signInWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  },

  // Phone Authentication
  signInWithPhone: async (phoneNumber: string, verificationCode: string) => {
    // Implementation would require phone verification setup
    throw new Error('Phone authentication requires additional setup');
  },

  updateProfile: async (displayName: string, photoURL?: string) => {
    if (auth.currentUser) {
      return await updateProfile(auth.currentUser, { displayName, photoURL });
    }
    throw new Error('No authenticated user');
  }
};

// User Profile Services
export const userService = {
  createUserProfile: async (uid: string, userData: any) => {
    const userRef = doc(db, 'users', uid);
    return await addDoc(collection(db, 'users'), {
      uid,
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  getUserProfile: async (uid: string) => {
    const userRef = doc(db, 'users', uid);
    return await getDoc(userRef);
  },

  updateUserProfile: async (uid: string, data: any) => {
    const userRef = doc(db, 'users', uid);
    return await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }
};

// Restaurant Services
export const restaurantService = {
  getRestaurants: async () => {
    const restaurantsRef = collection(db, 'restaurants');
    const q = query(restaurantsRef, where('isActive', '==', true));
    return await getDocs(q);
  },

  getRestaurantById: async (id: string) => {
    const restaurantRef = doc(db, 'restaurants', id);
    return await getDoc(restaurantRef);
  },

  createRestaurant: async (restaurantData: any) => {
    return await addDoc(collection(db, 'restaurants'), {
      ...restaurantData,
      createdAt: serverTimestamp(),
      isActive: true
    });
  },

  updateRestaurant: async (id: string, data: any) => {
    const restaurantRef = doc(db, 'restaurants', id);
    return await updateDoc(restaurantRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }
};

// Order Services (Real-time)
export const orderService = {
  createOrder: async (orderData: any) => {
    return await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  },

  getOrderById: async (id: string) => {
    const orderRef = doc(db, 'orders', id);
    return await getDoc(orderRef);
  },

  updateOrderStatus: async (id: string, status: string) => {
    const orderRef = doc(db, 'orders', id);
    return await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    });
  },

  // Real-time order updates
  subscribeToOrder: (orderId: string, callback: (order: any) => void) => {
    const orderRef = doc(db, 'orders', orderId);
    return onSnapshot(orderRef, (doc) => {
      callback({ id: doc.id, ...doc.data() });
    });
  },

  // Get orders for a specific user
  getUserOrders: async (userId: string, userRole: string) => {
    const ordersRef = collection(db, 'orders');
    let q;
    
    if (userRole === 'customer') {
      q = query(ordersRef, where('customerId', '==', userId), orderBy('createdAt', 'desc'));
    } else if (userRole === 'restaurant') {
      q = query(ordersRef, where('restaurantId', '==', userId), orderBy('createdAt', 'desc'));
    } else if (userRole === 'driver') {
      q = query(ordersRef, where('driverId', '==', userId), orderBy('createdAt', 'desc'));
    }
    
    return await getDocs(q!);
  }
};

// Menu Services
export const menuService = {
  getMenuItems: async (restaurantId: string) => {
    const menuRef = collection(db, 'menu_items');
    const q = query(menuRef, where('restaurantId', '==', restaurantId), where('isActive', '==', true));
    return await getDocs(q);
  },

  addMenuItem: async (menuItemData: any) => {
    return await addDoc(collection(db, 'menu_items'), {
      ...menuItemData,
      createdAt: serverTimestamp(),
      isActive: true
    });
  },

  updateMenuItem: async (id: string, data: any) => {
    const menuItemRef = doc(db, 'menu_items', id);
    return await updateDoc(menuItemRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }
};

// Storage Services
export const storageService = {
  uploadImage: async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },

  deleteImage: async (path: string) => {
    const storageRef = ref(storage, path);
    return await deleteObject(storageRef);
  }
};

// Real-time Services for Live Tracking
export const realtimeService = {
  // Track driver location
  subscribeToDriverLocation: (driverId: string, callback: (location: any) => void) => {
    const locationRef = doc(db, 'driver_locations', driverId);
    return onSnapshot(locationRef, (doc) => {
      callback(doc.data());
    });
  },

  // Track order status in real-time
  subscribeToOrderUpdates: (orderId: string, callback: (order: any) => void) => {
    return orderService.subscribeToOrder(orderId, callback);
  },

  // Update driver location
  updateDriverLocation: async (driverId: string, location: { lat: number; lng: number }) => {
    const locationRef = doc(db, 'driver_locations', driverId);
    return await updateDoc(locationRef, {
      ...location,
      timestamp: serverTimestamp()
    });
  }
};
