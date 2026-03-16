import type { Models } from 'appwrite'

export type UserRole = 'customer' | 'restaurant' | 'driver' | 'admin'

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface User extends Models.Document {
  name: string
  email: string
  phone?: string
  role: UserRole
  avatar_url?: string
  address?: string
  is_active: boolean
}

export interface Restaurant extends Models.Document {
  owner_id: string
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  image_url?: string
  is_active: boolean
  is_approved: boolean
  delivery_fee: number
  min_order: number
  commission_rate: number
  cuisine_type: string
  rating: number
  total_reviews: number
  estimated_delivery_time: string
}

export interface MenuItem extends Models.Document {
  restaurant_id: string
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  is_available: boolean
  is_featured: boolean
}

export interface CartItem extends Models.Document {
  user_id: string
  menu_item_id: string
  restaurant_id: string
  quantity: number
  item_name: string
  item_price: number
  restaurant_name: string
}

export interface Order extends Models.Document {
  customer_id: string
  restaurant_id: string
  driver_id?: string
  parent_checkout_id: string
  status: OrderStatus
  payment_status: PaymentStatus
  subtotal: number
  delivery_fee: number
  total_amount: number
  delivery_address: string
  customer_name: string
  customer_phone: string
  restaurant_name: string
  special_instructions?: string
  estimated_delivery: string
}

export interface OrderItem extends Models.Document {
  order_id: string
  menu_item_id: string
  quantity: number
  unit_price: number
  total_price: number
  item_name: string
}

export interface Payment extends Models.Document {
  checkout_id: string
  stripe_payment_id?: string
  total_amount: number
  status: PaymentStatus
  customer_id: string
}

export interface DeliveryLocation extends Models.Document {
  order_id: string
  driver_id: string
  latitude: number
  longitude: number
  timestamp: string
}

export interface Review extends Models.Document {
  user_id: string
  restaurant_id: string
  order_id: string
  rating: number
  comment?: string
  user_name: string
}

// Cart grouping by restaurant
export interface CartGroup {
  restaurant_id: string
  restaurant_name: string
  items: CartItem[]
  subtotal: number
  delivery_fee: number
}
