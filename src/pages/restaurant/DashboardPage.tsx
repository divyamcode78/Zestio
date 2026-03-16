import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { DollarSign, Package, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { databases, DATABASE_ID, COLLECTIONS, Query, isAppwriteConfigured, subscribeToCollection } from '@/lib/appwrite'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Order, Restaurant } from '@/types/database'

// Demo data
const demoStats = {
  todayRevenue: 456.78,
  todayOrders: 12,
  pendingOrders: 3,
  avgRating: 4.7,
}

const demoOrders: Order[] = [
  {
    $id: '1',
    $createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    $collectionId: COLLECTIONS.ORDERS,
    $databaseId: DATABASE_ID,
    customer_id: '1',
    restaurant_id: '1',
    parent_checkout_id: 'checkout_1',
    status: 'pending',
    payment_status: 'paid',
    subtotal: 27.98,
    delivery_fee: 3.99,
    total_amount: 31.97,
    delivery_address: '123 Main St, Apt 4B',
    customer_name: 'John Doe',
    customer_phone: '(555) 123-4567',
    restaurant_name: 'My Restaurant',
    estimated_delivery: '30-45 min',
  },
  {
    $id: '2',
    $createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    $collectionId: COLLECTIONS.ORDERS,
    $databaseId: DATABASE_ID,
    customer_id: '2',
    restaurant_id: '1',
    parent_checkout_id: 'checkout_2',
    status: 'preparing',
    payment_status: 'paid',
    subtotal: 45.98,
    delivery_fee: 3.99,
    total_amount: 49.97,
    delivery_address: '456 Oak Ave, Suite 2',
    customer_name: 'Jane Smith',
    customer_phone: '(555) 987-6543',
    restaurant_name: 'My Restaurant',
    estimated_delivery: '25-35 min',
  },
]

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  picked_up: 'bg-orange-100 text-orange-800',
}

export function RestaurantDashboard() {
  const { user } = useAuth()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [stats, setStats] = useState(demoStats)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)

      if (!isAppwriteConfigured() || !user) {
        setRecentOrders(demoOrders)
        setIsLoading(false)
        return
      }

      try {
        // Fetch restaurant owned by user
        const restaurantResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.RESTAURANTS, [
          Query.equal('owner_id', user.$id),
          Query.limit(1),
        ])

        if (restaurantResponse.documents.length > 0) {
          const rest = restaurantResponse.documents[0] as Restaurant
          setRestaurant(rest)

          // Fetch recent orders
          const ordersResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDERS, [
            Query.equal('restaurant_id', rest.$id),
            Query.orderDesc('$createdAt'),
            Query.limit(10),
          ])
          setRecentOrders(ordersResponse.documents as Order[])

          // Calculate stats
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const todayOrders = ordersResponse.documents.filter(
            (o) => new Date(o.$createdAt) >= today
          )
          const pendingOrders = ordersResponse.documents.filter(
            (o) => ['pending', 'confirmed'].includes(o.status)
          )

          setStats({
            todayRevenue: todayOrders.reduce((sum, o) => sum + (o as Order).total_amount, 0),
            todayOrders: todayOrders.length,
            pendingOrders: pendingOrders.length,
            avgRating: rest.rating,
          })
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        setRecentOrders(demoOrders)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Subscribe to real-time order updates
    if (isAppwriteConfigured() && user) {
      const unsubscribe = subscribeToCollection<Order>(COLLECTIONS.ORDERS, (response) => {
        if (response.events.some((e) => e.includes('create') || e.includes('update'))) {
          setRecentOrders((prev) => {
            const exists = prev.find((o) => o.$id === response.payload.$id)
            if (exists) {
              return prev.map((o) => (o.$id === response.payload.$id ? response.payload : o))
            }
            return [response.payload, ...prev].slice(0, 10)
          })
        }
      })

      return () => {
        if (typeof unsubscribe === 'function') unsubscribe()
      }
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your restaurant performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today{"'"}s Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.todayRevenue)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today{"'"}s Orders</p>
                <p className="text-2xl font-bold">{stats.todayOrders}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="ghost" asChild>
            <Link to="/restaurant/orders">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-medium">No orders yet</p>
              <p className="text-sm text-muted-foreground">Orders will appear here when customers place them</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order.$id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">#{order.$id.slice(0, 8)}</span>
                      <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.customer_name} • {formatDate(order.$createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
