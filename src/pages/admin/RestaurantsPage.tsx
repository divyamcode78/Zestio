import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Search, Store, MapPin, Star, Eye, Check, X, MoreHorizontal } from 'lucide-react'

interface Restaurant {
  id: string
  name: string
  email: string
  phone: string
  address: string
  cuisine: string
  rating: number
  totalReviews: number
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  createdAt: string
  ownerName: string
  deliveryFee: number
  minOrder: number
}

export function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cuisineFilter, setCuisineFilter] = useState('all')

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true)
      try {
        // Mock data for demo
        await new Promise(resolve => setTimeout(resolve, 1000))
        setRestaurants([
          {
            id: '1',
            name: 'Pizza Paradise',
            email: 'info@pizzaparadise.com',
            phone: '+1 234-567-8900',
            address: '123 Main St, New York, NY',
            cuisine: 'Italian',
            rating: 4.5,
            totalReviews: 128,
            status: 'pending',
            createdAt: '2024-01-18',
            ownerName: 'Mario Rossi',
            deliveryFee: 2.99,
            minOrder: 15,
          },
          {
            id: '2',
            name: 'Burger Barn',
            email: 'hello@burgerbarn.com',
            phone: '+1 234-567-8901',
            address: '456 Oak Ave, New York, NY',
            cuisine: 'American',
            rating: 4.2,
            totalReviews: 89,
            status: 'approved',
            createdAt: '2024-01-15',
            ownerName: 'John Smith',
            deliveryFee: 3.99,
            minOrder: 20,
          },
          {
            id: '3',
            name: 'Sushi Sensation',
            email: 'contact@sushisensation.com',
            phone: '+1 234-567-8902',
            address: '789 Pine St, New York, NY',
            cuisine: 'Japanese',
            rating: 4.8,
            totalReviews: 234,
            status: 'approved',
            createdAt: '2024-01-10',
            ownerName: 'Takeshi Yamamoto',
            deliveryFee: 4.99,
            minOrder: 25,
          },
          {
            id: '4',
            name: 'Taco Town',
            email: 'info@tacotown.com',
            phone: '+1 234-567-8903',
            address: '321 Elm St, New York, NY',
            cuisine: 'Mexican',
            rating: 4.0,
            totalReviews: 56,
            status: 'rejected',
            createdAt: '2024-01-08',
            ownerName: 'Maria Garcia',
            deliveryFee: 2.49,
            minOrder: 12,
          },
        ])
      } catch (error) {
        console.error('Failed to fetch restaurants:', error)
        toast.error('Failed to load restaurants')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || restaurant.status === statusFilter
    const matchesCuisine = cuisineFilter === 'all' || restaurant.cuisine === cuisineFilter
    
    return matchesSearch && matchesStatus && matchesCuisine
  })

  const getStatusColor = (status: Restaurant['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'suspended': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRestaurantAction = async (restaurantId: string, action: 'approve' | 'reject' | 'suspend') => {
    try {
      let newStatus: Restaurant['status']
      switch (action) {
        case 'approve':
          newStatus = 'approved'
          break
        case 'reject':
          newStatus = 'rejected'
          break
        case 'suspend':
          newStatus = 'suspended'
          break
      }
      
      setRestaurants(prev => prev.map(restaurant => 
        restaurant.id === restaurantId ? { ...restaurant, status: newStatus } : restaurant
      ))
      
      toast.success(`Restaurant ${action}d successfully`)
    } catch (error) {
      toast.error(`Failed to ${action} restaurant`)
    }
  }

  const cuisineTypes = ['all', 'Italian', 'American', 'Japanese', 'Mexican', 'Chinese', 'Indian', 'Thai']

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Restaurants</h1>
        <div className="grid gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Restaurants</h1>
        <Button>
          <Store className="mr-2 h-4 w-4" />
          Add Restaurant
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurants.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {restaurants.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {restaurants.filter(r => r.status === 'approved').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(restaurants.reduce((acc, r) => acc + r.rating, 0) / restaurants.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search restaurants by name or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cuisineTypes.map(cuisine => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Restaurants List */}
      <Card>
        <CardHeader>
          <CardTitle>All Restaurants ({filteredRestaurants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-8">
              <Store className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">No restaurants found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{restaurant.name}</p>
                        <Badge className={getStatusColor(restaurant.status)}>
                          {restaurant.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {restaurant.address}
                        </div>
                        <span>{restaurant.cuisine}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {restaurant.rating} ({restaurant.totalReviews})
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>Owner: {restaurant.ownerName}</span>
                        <span>Delivery: ${restaurant.deliveryFee}</span>
                        <span>Min: ${restaurant.minOrder}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {restaurant.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleRestaurantAction(restaurant.id, 'approve')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRestaurantAction(restaurant.id, 'reject')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {restaurant.status === 'approved' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRestaurantAction(restaurant.id, 'suspend')}
                      >
                        Suspend
                      </Button>
                    )}
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
