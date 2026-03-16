import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { MapPin, Clock, DollarSign, Package, Truck, CheckCircle } from 'lucide-react'

interface DeliveryOrder {
  id: string
  restaurantName: string
  customerName: string
  customerAddress: string
  restaurantAddress: string
  totalAmount: number
  estimatedTime: number
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered'
  specialInstructions?: string
  createdAt: string
}

export function DeliveriesPage() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        // Mock data for demo
        await new Promise(resolve => setTimeout(resolve, 1000))
        setOrders([
          {
            id: '1',
            restaurantName: 'Burger Palace',
            customerName: 'John Doe',
            customerAddress: '123 Main St, New York, NY',
            restaurantAddress: '456 Oak Ave, New York, NY',
            totalAmount: 25.99,
            estimatedTime: 25,
            status: 'pending',
            specialInstructions: 'Leave at door',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            restaurantName: 'Pizza Roma',
            customerName: 'Jane Smith',
            customerAddress: '789 Pine St, New York, NY',
            restaurantAddress: '321 Elm St, New York, NY',
            totalAmount: 32.50,
            estimatedTime: 30,
            status: 'accepted',
            createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
          },
          {
            id: '3',
            restaurantName: 'Sushi Master',
            customerName: 'Bob Johnson',
            customerAddress: '567 Maple Dr, New York, NY',
            restaurantAddress: '890 Birch Rd, New York, NY',
            totalAmount: 45.75,
            estimatedTime: 35,
            status: 'picked_up',
            createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
          },
        ])
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        toast.error('Failed to load delivery orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const acceptOrder = async (orderId: string) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'accepted' as const } : order
      ))
      toast.success('Order accepted successfully')
    } catch (error) {
      toast.error('Failed to accept order')
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: DeliveryOrder['status']) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      toast.success(`Order status updated to ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const getStatusColor = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-blue-100 text-blue-800'
      case 'picked_up': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'pending': return Clock
      case 'accepted': return Package
      case 'picked_up': return Truck
      case 'delivered': return CheckCircle
      default: return Clock
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Deliveries</h1>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Deliveries</h1>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Find Orders
        </Button>
      </div>

      {/* Available Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Available Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.filter(order => order.status === 'pending').length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">No available orders</p>
              <p className="text-sm text-muted-foreground">
                Check back later for new delivery opportunities
              </p>
            </div>
          ) : (
            orders.filter(order => order.status === 'pending').map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{order.restaurantName}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      <Clock className="mr-1 h-3 w-3" />
                      Pending
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      Pickup: {order.restaurantAddress}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      Dropoff: {order.customerAddress}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3" />
                      Earning: ${(order.totalAmount * 0.15).toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Est. time: {order.estimatedTime} min
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedOrder(order)
                      setShowDetails(true)
                    }}
                  >
                    Details
                  </Button>
                  <Button onClick={() => acceptOrder(order.id)}>
                    Accept
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Active Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Active Deliveries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.filter(order => ['accepted', 'picked_up'].includes(order.status)).length === 0 ? (
            <div className="text-center py-8">
              <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">No active deliveries</p>
              <p className="text-sm text-muted-foreground">
                Accepted orders will appear here
              </p>
            </div>
          ) : (
            orders.filter(order => ['accepted', 'picked_up'].includes(order.status)).map((order) => {
              const StatusIcon = getStatusIcon(order.status)
              return (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{order.restaurantName}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {order.status === 'accepted' ? 'Accepted' : 'Picked Up'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        Customer: {order.customerAddress}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3" />
                        Earning: ${(order.totalAmount * 0.15).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'accepted' && (
                      <Button onClick={() => updateOrderStatus(order.id, 'picked_up')}>
                        Mark Picked Up
                      </Button>
                    )}
                    {order.status === 'picked_up' && (
                      <Button onClick={() => updateOrderStatus(order.id, 'delivered')}>
                        Mark Delivered
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Restaurant</Label>
                <p className="font-medium">{selectedOrder.restaurantName}</p>
              </div>
              <div>
                <Label>Customer</Label>
                <p className="font-medium">{selectedOrder.customerName}</p>
              </div>
              <div>
                <Label>Pickup Address</Label>
                <p className="text-sm">{selectedOrder.restaurantAddress}</p>
              </div>
              <div>
                <Label>Delivery Address</Label>
                <p className="text-sm">{selectedOrder.customerAddress}</p>
              </div>
              <div>
                <Label>Special Instructions</Label>
                <p className="text-sm">{selectedOrder.specialInstructions || 'None'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Amount</Label>
                  <p className="font-medium">${selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <Label>Your Earning</Label>
                  <p className="font-medium">${(selectedOrder.totalAmount * 0.15).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    acceptOrder(selectedOrder.id)
                    setShowDetails(false)
                  }}
                  className="flex-1"
                >
                  Accept Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
