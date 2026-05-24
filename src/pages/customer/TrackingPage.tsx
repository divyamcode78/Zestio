import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router'
import { ArrowLeft, Phone, MapPin, Package, Truck, Check, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { databases, DATABASE_ID, COLLECTIONS, Query, isAppwriteConfigured, subscribeToDocument, subscribeToCollection } from '@/lib/appwrite'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Order, OrderStatus, DeliveryLocation } from '@/types/database'

// Lazy load Leaflet to avoid SSR issues
let L: typeof import('leaflet') | null = null
if (typeof window !== 'undefined') {
  import('leaflet').then((leaflet) => {
    L = leaflet.default
  })
}

const statusSteps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'pending', label: 'Order Placed', icon: <Clock className="h-4 w-4" /> },
  { status: 'confirmed', label: 'Confirmed', icon: <Check className="h-4 w-4" /> },
  { status: 'preparing', label: 'Preparing', icon: <Package className="h-4 w-4" /> },
  { status: 'ready', label: 'Ready for Pickup', icon: <Package className="h-4 w-4" /> },
  { status: 'picked_up', label: 'On the Way', icon: <Truck className="h-4 w-4" /> },
  { status: 'delivered', label: 'Delivered', icon: <Check className="h-4 w-4" /> },
]

const demoOrder: Order = {
  $id: '1',
  $createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  $updatedAt: new Date().toISOString(),
  $permissions: [],
  $collectionId: COLLECTIONS.ORDERS,
  $databaseId: DATABASE_ID,
  customer_id: '1',
  restaurant_id: '1',
  driver_id: 'driver_1',
  parent_checkout_id: 'checkout_1',
  status: 'picked_up',
  payment_status: 'paid',
  subtotal: 27.98,
  delivery_fee: 3.99,
  total_amount: 31.97,
  delivery_address: '123 Main St, Apt 4B, New York, NY',
  customer_name: 'John Doe',
  customer_phone: '(555) 123-4567',
  restaurant_name: 'Burger Palace',
  special_instructions: 'Ring doorbell',
  estimated_delivery: '10-15 min',
}

export function TrackingPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [driverLocation, setDriverLocation] = useState<DeliveryLocation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const driverMarkerRef = useRef<L.Marker | null>(null)

  // Fetch order and driver location
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)

      if (!isAppwriteConfigured() || !id) {
        setOrder(demoOrder)
        setDriverLocation({
          $id: '1',
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
          $permissions: [],
          $collectionId: COLLECTIONS.DELIVERY_LOCATIONS,
          $databaseId: DATABASE_ID,
          order_id: '1',
          driver_id: 'driver_1',
          latitude: 40.7549,
          longitude: -73.984,
          timestamp: new Date().toISOString(),
        })
        setIsLoading(false)
        return
      }

      try {
        // Fetch order
        const orderDoc = await databases.getDocument(DATABASE_ID, COLLECTIONS.ORDERS, id)
        setOrder(orderDoc as Order)

        // Fetch latest driver location
        if (orderDoc.driver_id) {
          const locationResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.DELIVERY_LOCATIONS, [
            Query.equal('order_id', id),
            Query.orderDesc('$createdAt'),
            Query.limit(1),
          ])
          if (locationResponse.documents.length > 0) {
            setDriverLocation(locationResponse.documents[0] as DeliveryLocation)
          }
        }
      } catch (error) {
        console.error('Failed to fetch tracking data:', error)
        setOrder(demoOrder)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Subscribe to real-time updates
    if (isAppwriteConfigured() && id) {
      const unsubscribeOrder = subscribeToDocument<Order>(COLLECTIONS.ORDERS, id, (response) => {
        if (response.events.some((e) => e.includes('update'))) {
          setOrder(response.payload)
        }
      })

      const unsubscribeLocation = subscribeToCollection<DeliveryLocation>(
        COLLECTIONS.DELIVERY_LOCATIONS,
        (response) => {
          if (response.payload.order_id === id) {
            setDriverLocation(response.payload)
          }
        }
      )

      return () => {
        if (typeof unsubscribeOrder === 'function') unsubscribeOrder()
        if (typeof unsubscribeLocation === 'function') unsubscribeLocation()
      }
    }
  }, [id])

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || !L || mapInstanceRef.current) return

    // Default center (New York)
    const center: [number, number] = [40.7128, -74.006]
    
    mapInstanceRef.current = L.map(mapRef.current).setView(center, 14)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstanceRef.current)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isLoading])

  // Update driver marker
  useEffect(() => {
    if (!mapInstanceRef.current || !driverLocation || !L) return

    const position: [number, number] = [driverLocation.latitude, driverLocation.longitude]

    if (driverMarkerRef.current) {
      driverMarkerRef.current.setLatLng(position)
    } else {
      const driverIcon = L.divIcon({
        className: 'driver-marker',
        html: `<div class="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
        </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })
      driverMarkerRef.current = L.marker(position, { icon: driverIcon }).addTo(mapInstanceRef.current)
    }

    mapInstanceRef.current.panTo(position)
  }, [driverLocation])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="aspect-video rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium">Order not found</p>
        <Button asChild className="mt-4">
          <Link to="/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.status === order.status)
  const progress = ((currentStepIndex + 1) / statusSteps.length) * 100

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order Tracking</h1>
          <p className="text-sm text-muted-foreground">
            Order #{order.$id.slice(0, 8)} from {order.restaurant_name}
          </p>
        </div>
        <Badge className="bg-accent text-accent-foreground">{order.estimated_delivery}</Badge>
      </div>

      {/* Map */}
      {order.status === 'picked_up' && (
        <Card>
          <CardContent className="p-0">
            <div ref={mapRef} className="h-64 w-full rounded-xl sm:h-80" />
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {statusSteps.map((step, index) => {
              const isComplete = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              return (
                <div
                  key={step.status}
                  className={`flex flex-col items-center gap-1 text-center ${
                    isComplete ? 'text-accent' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      isCurrent
                        ? 'bg-accent text-accent-foreground'
                        : isComplete
                          ? 'bg-accent/20'
                          : 'bg-muted'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span className="text-xs hidden sm:block">{step.label}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Delivery Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{order.delivery_address}</p>
            {order.special_instructions && (
              <p className="mt-2 text-sm text-muted-foreground">
                Note: {order.special_instructions}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Driver Info */}
        {order.driver_id && order.status === 'picked_up' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Your Driver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Driver</p>
                    <p className="text-sm text-muted-foreground">On the way</p>
                  </div>
                </div>
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery fee</span>
            <span>{formatCurrency(order.delivery_fee)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-medium">
            <span>Total</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
