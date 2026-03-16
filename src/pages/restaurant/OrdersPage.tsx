import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { databases, DATABASE_ID, COLLECTIONS, client } from '@/lib/appwrite'
import { Query } from 'appwrite'
import { Order, OrderItem, MenuItem } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Clock, CheckCircle, Package, Truck, XCircle } from 'lucide-react'

interface OrderWithItems extends Order {
  items: (OrderItem & { menuItem?: MenuItem })[]
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'bg-blue-100 text-blue-800' },
  preparing: { label: 'Preparing', icon: Package, color: 'bg-purple-100 text-purple-800' },
  ready_for_pickup: { label: 'Ready', icon: Package, color: 'bg-green-100 text-green-800' },
  picked_up: { label: 'Picked Up', icon: Truck, color: 'bg-indigo-100 text-indigo-800' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800' },
}

export function RestaurantOrdersPage() {
  const { profile } = useAuth()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    if (profile?.restaurant_id) {
      fetchOrders()
      
      // Subscribe to real-time order updates
      const unsubscribe = client.subscribe(
        `databases.${DATABASE_ID}.collections.${COLLECTIONS.ORDERS}.documents`,
        (response) => {
          if (response.events.includes('databases.*.collections.*.documents.*.create')) {
            const newOrder = response.payload as Order
            if (newOrder.restaurant_id === profile.restaurant_id) {
              fetchOrderWithItems(newOrder.$id).then((orderWithItems) => {
                if (orderWithItems) {
                  setOrders((prev) => [orderWithItems, ...prev])
                  toast.success('New order received!')
                }
              })
            }
          }
          if (response.events.includes('databases.*.collections.*.documents.*.update')) {
            const updatedOrder = response.payload as Order
            setOrders((prev) =>
              prev.map((o) =>
                o.$id === updatedOrder.$id ? { ...o, ...updatedOrder } : o
              )
            )
          }
        }
      )

      return () => {
        unsubscribe()
      }
    }
  }, [profile?.restaurant_id])

  const fetchOrderWithItems = async (orderId: string): Promise<OrderWithItems | null> => {
    try {
      const order = await databases.getDocument(DATABASE_ID, COLLECTIONS.ORDERS, orderId)
      const itemsRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDER_ITEMS, [
        Query.equal('order_id', orderId),
      ])
      
      const itemsWithMenu = await Promise.all(
        itemsRes.documents.map(async (item) => {
          try {
            const menuItem = await databases.getDocument(
              DATABASE_ID,
              COLLECTIONS.MENU_ITEMS,
              item.menu_item_id
            )
            return { ...item, menuItem } as OrderItem & { menuItem: MenuItem }
          } catch {
            return item as OrderItem
          }
        })
      )
      
      return { ...order, items: itemsWithMenu } as OrderWithItems
    } catch {
      return null
    }
  }

  const fetchOrders = async () => {
    if (!profile?.restaurant_id) return
    
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDERS, [
        Query.equal('restaurant_id', profile.restaurant_id),
        Query.orderDesc('$createdAt'),
        Query.limit(100),
      ])

      const ordersWithItems = await Promise.all(
        response.documents.map(async (order) => {
          const itemsRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDER_ITEMS, [
            Query.equal('order_id', order.$id),
          ])
          
          const itemsWithMenu = await Promise.all(
            itemsRes.documents.map(async (item) => {
              try {
                const menuItem = await databases.getDocument(
                  DATABASE_ID,
                  COLLECTIONS.MENU_ITEMS,
                  item.menu_item_id
                )
                return { ...item, menuItem } as OrderItem & { menuItem: MenuItem }
              } catch {
                return item as OrderItem
              }
            })
          )
          
          return { ...order, items: itemsWithMenu } as OrderWithItems
        })
      )

      setOrders(ordersWithItems)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.ORDERS, orderId, {
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      
      setOrders((prev) =>
        prev.map((o) =>
          o.$id === orderId ? { ...o, status: newStatus } : o
        )
      )
      
      toast.success(`Order status updated to ${statusConfig[newStatus as keyof typeof statusConfig]?.label}`)
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order status')
    }
  }

  const activeOrders = orders.filter((o) => 
    ['pending', 'confirmed', 'preparing', 'ready_for_pickup'].includes(o.status)
  )
  const completedOrders = orders.filter((o) => 
    ['picked_up', 'delivered', 'cancelled'].includes(o.status)
  )

  const getNextStatus = (currentStatus: string): string | null => {
    const flow: Record<string, string> = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready_for_pickup',
    }
    return flow[currentStatus] || null
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  const OrderCard = ({ order }: { order: OrderWithItems }) => {
    const status = statusConfig[order.status as keyof typeof statusConfig]
    const StatusIcon = status?.icon || Clock
    const nextStatus = getNextStatus(order.status)

    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Order #{order.$id.slice(-8)}</CardTitle>
            <Badge className={status?.color}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status?.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(order.$createdAt).toLocaleString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.$id} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.menuItem?.name || 'Item'}
                </span>
                <span className="text-muted-foreground">
                  ${(item.unit_price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${order.total_amount.toFixed(2)}</span>
            </div>
          </div>

          {order.special_instructions && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground">Special Instructions</p>
              <p className="text-sm">{order.special_instructions}</p>
            </div>
          )}

          <div className="flex gap-2">
            {nextStatus && (
              <Button
                onClick={() => updateOrderStatus(order.$id, nextStatus)}
                className="flex-1"
              >
                Mark as {statusConfig[nextStatus as keyof typeof statusConfig]?.label}
              </Button>
            )}
            {order.status === 'pending' && (
              <Button
                variant="destructive"
                onClick={() => updateOrderStatus(order.$id, 'cancelled')}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Orders</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {activeOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No active orders</p>
                <p className="text-sm text-muted-foreground">
                  New orders will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeOrders.map((order) => (
                <OrderCard key={order.$id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          {completedOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No completed orders</p>
                <p className="text-sm text-muted-foreground">
                  Completed orders will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedOrders.map((order) => (
                <OrderCard key={order.$id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
