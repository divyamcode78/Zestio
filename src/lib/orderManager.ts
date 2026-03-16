import type { Order, OrderStatus } from '@/types/database'

const ORDER_STORAGE_KEY = 'zestio_orders'
const ORDER_STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered']

export interface OrderInput {
  customer_id: string
  restaurant_id: string
  restaurant_name: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  delivery_fee: number
  total_amount: number
  delivery_address: string
  customer_name: string
  customer_phone: string
  special_instructions?: string
}

export function createOrder(orderData: OrderInput): Order {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 9)
  const orderId = `ORD_${timestamp}_${randomSuffix}`
  const paymentId = `PAY_${timestamp}_${randomSuffix}`
  const now = new Date().toISOString()
  
  const order: Order = {
    $id: orderId,
    $createdAt: now,
    $updatedAt: now,
    $permissions: [],
    $collectionId: 'orders',
    $databaseId: 'zestio_db',
    customer_id: orderData.customer_id,
    restaurant_id: orderData.restaurant_id,
    parent_checkout_id: paymentId, // Use real payment ID instead of mock
    status: 'pending',
    payment_status: 'paid',
    subtotal: orderData.subtotal,
    delivery_fee: orderData.delivery_fee,
    total_amount: orderData.total_amount,
    delivery_address: orderData.delivery_address,
    customer_name: orderData.customer_name,
    customer_phone: orderData.customer_phone,
    restaurant_name: orderData.restaurant_name,
    special_instructions: orderData.special_instructions || '',
    estimated_delivery: '30-45 min',
  }

  // Save order to localStorage
  const orders = getOrders()
  orders.push(order)
  saveOrders(orders)

  // Start order status progression
  startOrderProgression(orderId)

  return order
}

export function getOrders(customerId?: string): Order[] {
  const stored = localStorage.getItem(ORDER_STORAGE_KEY)
  const orders: Order[] = stored ? JSON.parse(stored) : []
  
  // Update order statuses based on time
  const updatedOrders = orders.map(order => updateOrderStatus(order))
  
  // Save updated orders
  saveOrders(updatedOrders)
  
  // Filter by customer if specified
  return customerId 
    ? updatedOrders.filter(order => order.customer_id === customerId)
    : updatedOrders
}

export function getCustomerOrders(customerId: string): Order[] {
  return getOrders(customerId)
}

function updateOrderStatus(order: Order): Order {
  const now = new Date()
  const orderTime = new Date(order.$createdAt)
  const minutesElapsed = (now.getTime() - orderTime.getTime()) / (1000 * 60)

  // Find the appropriate status based on elapsed time
  let newStatus: OrderStatus = order.status
  
  if (minutesElapsed >= 3) {
    // After 3 minutes, mark as delivered (move to past orders)
    newStatus = 'delivered'
  } else if (minutesElapsed >= 2) {
    newStatus = 'picked_up'
  } else if (minutesElapsed >= 1.5) {
    newStatus = 'ready'
  } else if (minutesElapsed >= 1) {
    newStatus = 'preparing'
  } else if (minutesElapsed >= 0.5) {
    newStatus = 'confirmed'
  }

  if (newStatus !== order.status) {
    return {
      ...order,
      status: newStatus,
      $updatedAt: now.toISOString()
    }
  }

  return order
}

function startOrderProgression(orderId: string) {
  // Set up intervals to update order status
  const intervals = [
    { delay: 30000, status: 'confirmed' },      // 30 seconds
    { delay: 60000, status: 'preparing' },      // 1 minute
    { delay: 90000, status: 'ready' },          // 1.5 minutes
    { delay: 120000, status: 'picked_up' },      // 2 minutes
    { delay: 180000, status: 'delivered' },      // 3 minutes
  ]

  intervals.forEach(({ delay, status }) => {
    setTimeout(() => {
      const orders = getOrders()
      const orderIndex = orders.findIndex(o => o.$id === orderId)
      
      if (orderIndex !== -1) {
        orders[orderIndex] = {
          ...orders[orderIndex],
          status: status as OrderStatus,
          $updatedAt: new Date().toISOString()
        }
        saveOrders(orders)
        
        // Trigger a custom event to notify components
        window.dispatchEvent(new CustomEvent('orderUpdated', {
          detail: { orderId, status: status as OrderStatus }
        }))
      }
    }, delay)
  })
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders))
}

export function clearOrders(customerId?: string) {
  if (customerId) {
    const orders = getOrders()
    const filteredOrders = orders.filter(order => order.customer_id !== customerId)
    saveOrders(filteredOrders)
  } else {
    localStorage.removeItem(ORDER_STORAGE_KEY)
  }
}

// Check and update order statuses periodically
export function startOrderStatusChecker() {
  setInterval(() => {
    getOrders() // This will update statuses automatically
  }, 30000) // Check every 30 seconds
}
