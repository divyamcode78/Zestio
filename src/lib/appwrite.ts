import { Client, Account, Databases, Storage, ID, Query, Models, RealtimeResponseEvent } from 'appwrite'

const client = new Client()

// Initialize with environment variables
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || ''

if (projectId) {
  client.setEndpoint(endpoint).setProject(projectId)
}

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

export { client, ID, Query }
export type { Models, RealtimeResponseEvent }

// Database and collection IDs
export const DATABASE_ID = 'zestio_db'

export const COLLECTIONS = {
  USERS: 'users',
  RESTAURANTS: 'restaurants',
  MENU_ITEMS: 'menu_items',
  CART_ITEMS: 'cart_items',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  PAYMENTS: 'payments',
  DELIVERY_LOCATIONS: 'delivery_locations',
  REVIEWS: 'reviews',
} as const

export const STORAGE_BUCKETS = {
  RESTAURANT_IMAGES: 'restaurant_images',
  MENU_IMAGES: 'menu_images',
  USER_AVATARS: 'user_avatars',
} as const

export const STORAGE_BUCKET_ID = STORAGE_BUCKETS.MENU_IMAGES

// Helper to check if Appwrite is configured
export function isAppwriteConfigured(): boolean {
  return Boolean(projectId)
}

// Mock data functions for when Appwrite is not configured
export function createMockClient() {
  return {
    account: {
      get: () => Promise.resolve({ $id: 'demo', name: 'Demo User', email: 'demo@example.com' }),
      create: () => Promise.resolve({ $id: 'demo' }),
      createEmailSession: () => Promise.resolve({ $id: 'demo-session' }),
      deleteSession: () => Promise.resolve(),
      createJWT: () => Promise.resolve({ jwt: 'demo-jwt' }),
    },
    databases: {
      listDocuments: () => Promise.resolve({ documents: [] }),
      createDocument: () => Promise.resolve({ $id: 'demo-doc' }),
      updateDocument: () => Promise.resolve({ $id: 'demo-doc' }),
      deleteDocument: () => Promise.resolve(),
      getDocument: () => Promise.resolve({ $id: 'demo-doc' }),
    },
    storage: {
      createFile: () => Promise.resolve({ $id: 'demo-file' }),
      getFilePreview: () => ({ href: '' }),
      deleteFile: () => Promise.resolve(),
    }
  }
}

// Realtime subscription helpers
export function subscribeToCollection<T>(
  collectionId: string,
  callback: (response: RealtimeResponseEvent<T>) => void
) {
  if (!isAppwriteConfigured()) return () => {}
  
  return client.subscribe(
    `databases.${DATABASE_ID}.collections.${collectionId}.documents`,
    callback
  )
}

export function subscribeToDocument<T>(
  collectionId: string,
  documentId: string,
  callback: (response: RealtimeResponseEvent<T>) => void
) {
  if (!isAppwriteConfigured()) return () => {}
  
  return client.subscribe(
    `databases.${DATABASE_ID}.collections.${collectionId}.documents.${documentId}`,
    callback
  )
}
