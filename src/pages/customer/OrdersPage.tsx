import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Package, Clock, Check, Truck, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { databases, DATABASE_ID, COLLECTIONS, Query, isAppwriteConfigured, subscribeToCollection } from '@/lib/appwrite'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getCustomerOrders, startOrderStatusChecker } from '@/lib/orderManager'
import type { Order, OrderStatus } from '@/types/database'

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: 'Pending', icon: <Clock className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', icon: <Check className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
  preparing: { label: 'Preparing', icon: <Package className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
  ready: { label: 'Ready', icon: <Package className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-800' },
  picked_up: { label: 'On the way', icon: <Truck className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
  delivered: { label: 'Delivered', icon: <Check className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', icon: <Clock className="h-4 w-4" />, color: 'bg-red-100 text-red-800' },
}

export function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active')

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true)

      if (!isAppwriteConfigured() || !user) {
        // Use order manager for demo/local orders
        const customerOrders = getCustomerOrders(user?.id?.toString() || 'demo_user')
        setOrders(customerOrders)
        setIsLoading(false)
        return
      }

      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDERS, [
          Query.equal('customer_id', user.id.toString()),
          Query.orderDesc('$createdAt'),
          Query.limit(50),
        ])
        setOrders(response.documents as Order[])
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        // Fallback to order manager
        const customerOrders = getCustomerOrders(user.id.toString())
        setOrders(customerOrders)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()

    // Start the order status checker
    startOrderStatusChecker()

    // Subscribe to order updates from order manager
    const handleOrderUpdate = (event: CustomEvent) => {
      if (user && event.detail.orderId) {
        fetchOrders() // Refresh orders when status changes
      }
    }

    window.addEventListener('orderUpdated', handleOrderUpdate as EventListener)

    // Subscribe to real-time updates from Appwrite
    if (isAppwriteConfigured() && user) {
      const unsubscribe = subscribeToCollection<Order>(COLLECTIONS.ORDERS, (response) => {
        if (response.events.some((e) => e.includes('update'))) {
          const updatedOrder = response.payload
          if (updatedOrder.customer_id === user.id.toString()) {
            setOrders((prev) =>
              prev.map((order) => (order.$id === updatedOrder.$id ? updatedOrder : order))
            )
          }
        }
      })

      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
        window.removeEventListener('orderUpdated', handleOrderUpdate as EventListener)
      }
    }

    return () => {
      window.removeEventListener('orderUpdated', handleOrderUpdate as EventListener)
    }
  }, [user])

  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status))
  const pastOrders = orders.filter((o) => ['delivered', 'cancelled'].includes(o.status))

  const displayOrders = activeTab === 'active' ? activeOrders : pastOrders

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Orders</h1>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'past')}>
        <TabsList>
          <TabsTrigger value="active">
            Active
            {activeOrders.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">Past Orders</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : displayOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-medium">
                {activeTab === 'active' ? 'No active orders' : 'No past orders'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'active'
                  ? 'Your active orders will appear here'
                  : 'Your order history will appear here'}
              </p>
              {activeTab === 'active' && (
                <Button asChild className="mt-4">
                  <Link to="/">Order Now</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {displayOrders.map((order) => {
                const status = statusConfig[order.status]
                return (
                  <Card key={order.$id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{order.restaurant_name}</h3>
                            <Badge className={status.color}>
                              {status.icon}
                              <span className="ml-1">{status.label}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Order #{order.$id.slice(0, 8)} • {formatDate(order.$createdAt)}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="line-clamp-1">{order.delivery_address}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
                            <p className="text-xs text-muted-foreground">{order.estimated_delivery}</p>
                          </div>
                          {!['delivered', 'cancelled'].includes(order.status) && (
                            <Button asChild size="sm">
                              <Link to={`/orders/${order.$id}/tracking`}>Track Order</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
