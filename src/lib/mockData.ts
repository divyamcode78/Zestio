// Mock data for local development when Appwrite is not configured
import type { Models } from 'appwrite'

export interface User extends Models.Document {
  name: string
  email: string
  role: 'customer' | 'restaurant' | 'driver' | 'admin'
  restaurant_id?: string
  phone?: string
  address?: string
  avatar_url?: string
  is_active: boolean
}

export interface Restaurant extends Models.Document {
  owner_id: string
  name: string
  description: string
  cuisine_type: string
  address: string
  phone: string
  email: string
  image_url?: string
  cover_image_url?: string
  is_active: boolean
  is_approved: boolean
  is_featured?: boolean
  delivery_fee: number
  min_order: number
  commission_rate: number
  rating: number
  total_reviews: number
  estimated_delivery_time: string
  latitude?: number
  longitude?: number
  is_open: boolean
  opening_hours: string
}

export interface MenuItem extends Models.Document {
  restaurant_id: string
  name: string
  description?: string
  price: number
  category: string
  image_url?: string
  is_available: boolean
  is_featured: boolean
  prep_time_minutes?: number
}

export interface Order extends Models.Document {
  customer_id: string
  restaurant_id: string
  driver_id?: string
  parent_checkout_id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  subtotal: number
  delivery_fee: number
  total_amount: number
  delivery_address: string
  customer_name: string
  customer_phone: string
  restaurant_name: string
  special_instructions?: string
  estimated_delivery: string
  estimated_time: number
  actual_time?: number
}

export interface OrderItem extends Models.Document {
  order_id: string
  menu_item_id: string
  quantity: number
  unit_price: number
  total_price: number
  item_name: string
}

// Mock Users
export const mockUsers: User[] = [
  {
    $id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    phone: '+1234567890',
    address: '123 MG Road, Mumbai, India',
    is_active: true,
    $collectionId: 'users',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    $id: '2',
    name: 'Mario Rossi',
    email: 'mario@pizzaparadise.com',
    role: 'restaurant',
    restaurant_id: '1',
    phone: '+1234567891',
    address: '456 Oak Ave, New York, NY',
    is_active: true,
    $collectionId: 'users',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-10T00:00:00Z',
    $updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    $id: '3',
    name: 'John Smith',
    email: 'john@burgerbarn.com',
    role: 'restaurant',
    restaurant_id: '2',
    phone: '+1234567892',
    address: '789 Pine St, New York, NY',
    is_active: true,
    $collectionId: 'users',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-12T00:00:00Z',
    $updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    $id: '4',
    name: 'Bob Driver',
    email: 'bob@driver.com',
    role: 'driver',
    phone: '+1234567893',
    address: '321 Elm St, New York, NY',
    is_active: true,
    $collectionId: 'users',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-08T00:00:00Z',
    $updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    $id: '5',
    name: 'Admin User',
    email: 'admin@zestio.com',
    role: 'admin',
    phone: '+1234567894',
    address: 'Admin Office, New York, NY',
    is_active: true,
    $collectionId: 'users',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-01T00:00:00Z',
    $updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Mock Restaurants
export const mockRestaurants: Restaurant[] = [
  {
    $id: '1',
    name: 'Pizza Paradise',
    description: 'Authentic Italian pizza made with fresh ingredients and traditional techniques',
    cuisine_type: 'Italian',
    address: '456 Oak Ave, New York, NY',
    phone: '+1 234-567-8901',
    email: 'info@pizzaparadise.com',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    cover_image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=400&fit=crop',
    is_active: true,
    is_approved: true,
    delivery_fee: 2.99,
    min_order: 15,
    commission_rate: 0.15,
    rating: 4.5,
    total_reviews: 128,
    estimated_delivery_time: '30-40 min',
    owner_id: '2',
    latitude: 40.7589,
    longitude: -73.9851,
    is_open: true,
    opening_hours: '11:00-23:00',
    $collectionId: 'restaurants',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-10T00:00:00Z',
    $updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    $id: '2',
    name: 'Burger Barn',
    description: 'Gourmet burgers with premium ingredients and homemade sauces',
    cuisine_type: 'American',
    address: '789 Brigade Road, Bangalore, India',
    phone: '+1 234-567-8902',
    email: 'hello@burgerbarn.com',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
    cover_image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=400&fit=crop',
    is_active: true,
    is_approved: true,
    delivery_fee: 3.99,
    min_order: 20,
    commission_rate: 0.15,
    rating: 4.2,
    total_reviews: 89,
    estimated_delivery_time: '25-35 min',
    owner_id: '3',
    latitude: 40.7484,
    longitude: -73.9857,
    is_open: true,
    opening_hours: '10:00-24:00',
    $collectionId: 'restaurants',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-12T00:00:00Z',
    $updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    $id: '3',
    name: 'Sushi Sensation',
    description: 'Fresh sushi and Japanese cuisine prepared by expert chefs',
    cuisine_type: 'Japanese',
    address: '321 Connaught Place, New Delhi, India',
    phone: '+1 234-567-8903',
    email: 'contact@sushisensation.com',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    cover_image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=400&fit=crop',
    is_active: true,
    is_approved: true,
    delivery_fee: 4.99,
    min_order: 25,
    commission_rate: 0.15,
    rating: 4.8,
    total_reviews: 156,
    estimated_delivery_time: '35-45 min',
    owner_id: '4',
    latitude: 40.7614,
    longitude: -73.9776,
    is_open: true,
    opening_hours: '12:00-22:00',
    $collectionId: 'restaurants',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    $id: '4',
    name: 'Taco Town',
    description: 'Authentic Mexican street food and traditional tacos',
    cuisine_type: 'Mexican',
    address: '567 Marine Drive, Mumbai, India',
    phone: '+1 234-567-8904',
    email: 'info@tacotown.com',
    image_url: 'https://images.unsplash.com/photo-1772458251839-cbd3ef8b7018?w=800&h=600&fit=crop&auto=format',
    cover_image_url: 'https://images.unsplash.com/photo-1772458251839-cbd3ef8b7018?w=1200&h=400&fit=crop&auto=format',
    is_active: true,
    is_approved: true,
    is_featured: true,
    delivery_fee: 2.49,
    min_order: 12,
    commission_rate: 0.15,
    rating: 4.0,
    total_reviews: 56,
    estimated_delivery_time: '20-30 min',
    owner_id: '2',
    latitude: 40.7614,
    longitude: -73.9776,
    is_open: true,
    opening_hours: '11:00-23:00',
    $collectionId: 'restaurants',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-05T00:00:00Z',
    $updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    $id: '5',
    name: 'Dragon Palace',
    description: 'Authentic Chinese cuisine with traditional recipes and modern presentation',
    cuisine_type: 'Chinese',
    address: '891 Park Street, Kolkata, India',
    phone: '+1 234-567-8905',
    email: 'info@dragonpalace.com',
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop',
    cover_image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&h=400&fit=crop',
    is_active: true,
    is_approved: true,
    delivery_fee: 3.49,
    min_order: 18,
    commission_rate: 0.15,
    rating: 4.6,
    total_reviews: 203,
    estimated_delivery_time: '30-40 min',
    owner_id: '5',
    latitude: 40.7580,
    longitude: -73.9855,
    is_open: true,
    opening_hours: '11:30-22:30',
    $collectionId: 'restaurants',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-18T00:00:00Z',
    $updatedAt: '2024-01-18T00:00:00Z'
  },
  {
    $id: '6',
    name: 'Pasta Paradise',
    description: 'Homemade Italian pasta with fresh ingredients and traditional cooking methods',
    cuisine_type: 'Italian',
    address: '234 Necklace Road, Hyderabad, India',
    phone: '+1 234-567-8906',
    email: 'hello@pastaparadise.com',
    image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
    cover_image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&h=400&fit=crop',
    is_active: true,
    is_approved: true,
    delivery_fee: 2.99,
    min_order: 15,
    commission_rate: 0.15,
    rating: 4.4,
    total_reviews: 167,
    estimated_delivery_time: '25-35 min',
    owner_id: '6',
    latitude: 40.7614,
    longitude: -73.9776,
    is_open: true,
    opening_hours: '12:00-23:00',
    $collectionId: 'restaurants',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-20T00:00:00Z',
    $updatedAt: '2024-01-20T00:00:00Z'
  }
]

// Mock Menu Items
export const mockMenuItems: MenuItem[] = [
  // Pizza Paradise Items
  {
    $id: '1',
    restaurant_id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, basil',
    price: 12.99,
    category: 'Main Course',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: true,
    prep_time_minutes: 20,
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  {
    $id: '2',
    restaurant_id: '1',
    name: 'Pepperoni Pizza',
    description: 'Pepperoni, mozzarella, tomato sauce',
    price: 14.99,
    category: 'Main Course',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: false,
    prep_time_minutes: 20,
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  {
    $id: '3',
    restaurant_id: '1',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, parmesan, croutons, caesar dressing',
    price: 8.99,
    category: 'Appetizers',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: false,
    prep_time_minutes: 10,
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  {
    $id: '4',
    restaurant_id: '1',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 6.99,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: true,
    prep_time_minutes: 5,
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  // Burger Barn Items
  {
    $id: '5',
    restaurant_id: '2',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheese, lettuce, tomato, and our special sauce',
    price: 12.99,
    category: 'Burgers',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: true,
    prep_time_minutes: 15,
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  {
    $id: '6',
    restaurant_id: '2',
    name: 'Bacon Deluxe',
    description: 'Double patty with crispy bacon, cheddar cheese, and BBQ sauce',
    price: 15.99,
    category: 'Burgers',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: false,
    prep_time_minutes: 18,
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  {
    $id: '7',
    restaurant_id: '2',
    name: 'Crispy Fries',
    description: 'Golden french fries with sea salt',
    price: 4.99,
    category: 'Sides',
    image_url: 'https://images.unsplash.com/photo-1576107232686-3c30249c9ec8?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: false,
    prep_time_minutes: 8,
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  // Sushi Sensation Items
  {
    $id: '8',
    restaurant_id: '3',
    name: 'Salmon Sashimi',
    description: 'Fresh salmon sashimi with wasabi and ginger',
    price: 18.99,
    category: 'Sushi',
    image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17a4d6b4?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: true,
    prep_time_minutes: 12,
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  {
    $id: '9',
    restaurant_id: '3',
    name: 'California Roll',
    description: 'Crab, avocado, and cucumber roll',
    price: 12.99,
    category: 'Rolls',
    image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17a4d6b4?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: false,
    prep_time_minutes: 10,
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  // Taco Town Items
  {
    $id: '10',
    restaurant_id: '4',
    name: 'Street Tacos',
    description: 'Authentic street tacos with your choice of fillings',
    price: 8.99,
    category: 'Main Course',
    image_url: 'https://images.unsplash.com/photo-1571095819172-7a4b8b5b6f5?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: true,
    prep_time_minutes: 12,
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  {
    $id: '11',
    restaurant_id: '4',
    name: 'Quesadilla',
    description: 'Cheese-filled tortillas with sour cream and guacamole',
    price: 7.99,
    category: 'Appetizers',
    image_url: 'https://images.unsplash.com/photo-1571095819172-7a4b8b5b6f5?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: false,
    prep_time_minutes: 8,
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  {
    $id: '12',
    restaurant_id: '4',
    name: 'Nachos Supreme',
    description: 'Loaded nachos with cheese, jalapeños, and all toppings',
    price: 9.99,
    category: 'Appetizers',
    image_url: 'https://images.unsplash.com/photo-1571095819172-7a4b8b5b6f5?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: false,
    prep_time_minutes: 10,
    $createdAt: '2024-01-15T00:00:00Z',
    $updatedAt: '2024-01-15T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  // Dragon Palace Items
  {
    $id: '13',
    restaurant_id: '5',
    name: 'Sweet and Sour Chicken',
    description: 'Crispy chicken with tangy sweet and sour sauce',
    price: 14.99,
    category: 'Main Course',
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: true,
    prep_time_minutes: 20,
    $createdAt: '2024-01-18T00:00:00Z',
    $updatedAt: '2024-01-18T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  {
    $id: '14',
    restaurant_id: '5',
    name: 'Beef Chow Mein',
    description: 'Stir-fried noodles with beef and vegetables',
    price: 13.99,
    category: 'Main Course',
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: false,
    prep_time_minutes: 18,
    $createdAt: '2024-01-18T00:00:00Z',
    $updatedAt: '2024-01-18T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  {
    $id: '15',
    restaurant_id: '5',
    name: 'Spring Rolls',
    description: 'Crispy vegetable spring rolls with sweet chili sauce',
    price: 6.99,
    category: 'Appetizers',
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: false,
    prep_time_minutes: 10,
    $createdAt: '2024-01-18T00:00:00Z',
    $updatedAt: '2024-01-18T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  // Pasta Paradise Items
  {
    $id: '16',
    restaurant_id: '6',
    name: 'Spaghetti Carbonara',
    description: 'Classic Roman pasta with eggs, cheese, and pancetta',
    price: 15.99,
    category: 'Main Course',
    image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: true,
    prep_time_minutes: 22,
    $createdAt: '2024-01-20T00:00:00Z',
    $updatedAt: '2024-01-20T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  {
    $id: '17',
    restaurant_id: '6',
    name: 'Fettuccine Alfredo',
    description: 'Creamy pasta with parmesan cheese and butter',
    price: 14.99,
    category: 'Main Course',
    image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: false,
    prep_time_minutes: 20,
    $createdAt: '2024-01-20T00:00:00Z',
    $updatedAt: '2024-01-20T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  },
  {
    $id: '18',
    restaurant_id: '6',
    name: 'Caesar Salad',
    description: 'Romaine lettuce with caesar dressing and croutons',
    price: 8.99,
    category: 'Appetizers',
    image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    is_available: true,
    is_featured: false,
    prep_time_minutes: 8,
    $createdAt: '2024-01-20T00:00:00Z',
    $updatedAt: '2024-01-20T00:00:00Z',
    $collectionId: 'menu_items',
    $databaseId: 'zestio_db',
    $permissions: []
  }
]

// Mock Orders
export const mockOrders: Order[] = [
  {
    $id: '1',
    customer_id: '1',
    restaurant_id: '1',
    driver_id: '4',
    parent_checkout_id: 'checkout_123',
    status: 'delivered',
    total_amount: 25.97,
    subtotal: 22.98,
    delivery_fee: 2.99,
    payment_status: 'paid',
    special_instructions: 'Extra napkins please',
    delivery_address: '123 Main St, Mumbai, India',
    estimated_delivery: '2024-01-15T12:35:00Z',
    estimated_time: 35,
    actual_time: 32,
    customer_name: 'John Doe',
    customer_phone: '+1234567890',
    restaurant_name: 'Pizza Paradise',
    driver_name: 'Bob Driver',
    $collectionId: 'orders',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-15T12:00:00Z',
    $updatedAt: '2024-01-15T12:32:00Z'
  },
  {
    $id: '2',
    customer_id: '1',
    restaurant_id: '2',
    parent_checkout_id: 'checkout_456',
    status: 'confirmed',
    total_amount: 28.98,
    subtotal: 25.00,
    delivery_fee: 3.98,
    payment_status: 'paid',
    delivery_address: '123 Main St, Mumbai, India',
    estimated_delivery: '2024-01-15T14:30:00Z',
    estimated_time: 30,
    customer_name: 'John Doe',
    customer_phone: '+1234567890',
    restaurant_name: 'Burger Barn',
    $collectionId: 'orders',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-15T14:00:00Z',
    $updatedAt: '2024-01-15T14:00:00Z'
  },
  {
    $id: '3',
    customer_id: '1',
    restaurant_id: '3',
    parent_checkout_id: 'checkout_789',
    status: 'preparing',
    total_amount: 31.98,
    subtotal: 27.00,
    delivery_fee: 4.98,
    payment_status: 'paid',
    delivery_address: '123 Main St, Mumbai, India',
    estimated_delivery: '2024-01-15T16:40:00Z',
    estimated_time: 40,
    customer_name: 'John Doe',
    customer_phone: '+1234567890',
    restaurant_name: 'Sushi Sensation',
    $collectionId: 'orders',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-15T16:00:00Z',
    $updatedAt: '2024-01-15T16:00:00Z'
  }
]

// Mock Order Items
export const mockOrderItems: OrderItem[] = [
  {
    $id: '1',
    order_id: '1',
    menu_item_id: '1',
    quantity: 1,
    unit_price: 12.99,
    total_price: 12.99,
    item_name: 'Margherita Pizza',
    $collectionId: 'order_items',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-20T12:00:00Z',
    $updatedAt: '2024-01-20T12:00:00Z'
  },
  {
    $id: '2',
    order_id: '1',
    menu_item_id: '3',
    quantity: 1,
    unit_price: 8.99,
    total_price: 8.99,
    item_name: 'Caesar Salad',
    $collectionId: 'order_items',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-20T12:00:00Z',
    $updatedAt: '2024-01-20T12:00:00Z'
  },
  {
    $id: '3',
    order_id: '2',
    menu_item_id: '5',
    quantity: 1,
    unit_price: 10.99,
    total_price: 10.99,
    item_name: 'Classic Cheeseburger',
    $collectionId: 'order_items',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-20T13:00:00Z',
    $updatedAt: '2024-01-20T13:00:00Z'
  },
  {
    $id: '4',
    order_id: '2',
    menu_item_id: '7',
    quantity: 1,
    unit_price: 4.99,
    total_price: 4.99,
    item_name: 'Crispy Fries',
    $collectionId: 'order_items',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-20T13:00:00Z',
    $updatedAt: '2024-01-20T13:00:00Z'
  },
  {
    $id: '5',
    order_id: '3',
    menu_item_id: '9',
    quantity: 2,
    unit_price: 8.99,
    total_price: 17.98,
    item_name: 'California Roll',
    $collectionId: 'order_items',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-20T14:00:00Z',
    $updatedAt: '2024-01-20T14:00:00Z'
  },
  {
    $id: '6',
    order_id: '3',
    menu_item_id: '11',
    quantity: 1,
    unit_price: 3.99,
    total_price: 3.99,
    item_name: 'Quesadilla',
    $collectionId: 'order_items',
    $databaseId: 'zestio_db',
    $permissions: [],
    $createdAt: '2024-01-20T14:00:00Z',
    $updatedAt: '2024-01-20T14:00:00Z'
  }
]
