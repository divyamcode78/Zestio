import { useState, useEffect } from 'react'
import { Search, Filter, Plus, Eye, Edit, Trash2, Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  restaurant_name: string
  is_available: boolean
  is_featured: boolean
  image_url?: string
  created_at: string
}

interface Restaurant {
  id: string
  name: string
  cuisine_type: string
}

const mockRestaurants: Restaurant[] = [
  { id: '1', name: 'Pizza Paradise', cuisine_type: 'Italian' },
  { id: '2', name: 'Burger Barn', cuisine_type: 'American' },
  { id: '3', name: 'Sushi Sensation', cuisine_type: 'Japanese' },
  { id: '4', name: 'Taco Town', cuisine_type: 'Mexican' },
  { id: '5', name: 'Dragon Palace', cuisine_type: 'Chinese' },
  { id: '6', name: 'Pasta Paradise', cuisine_type: 'Italian' },
]

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, basil, and tomato sauce on our classic dough',
    price: 12.99,
    category: 'Pizza',
    restaurant_name: 'Pizza Paradise',
    is_available: true,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    created_at: '2024-03-10T10:00:00Z'
  },
  {
    id: '2',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheese, lettuce, tomato, and our special sauce',
    price: 10.99,
    category: 'Burgers',
    restaurant_name: 'Burger Barn',
    is_available: true,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
    created_at: '2024-03-10T11:00:00Z'
  },
  {
    id: '3',
    name: 'California Roll',
    description: 'Crab, avocado, and cucumber rolled with sesame seeds',
    price: 8.99,
    category: 'Rolls',
    restaurant_name: 'Sushi Sensation',
    is_available: true,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    created_at: '2024-03-10T12:00:00Z'
  },
  {
    id: '4',
    name: 'Classic Beef Taco',
    description: 'Seasoned beef with lettuce, cheese, and salsa in a corn tortilla',
    price: 3.99,
    category: 'Tacos',
    restaurant_name: 'Taco Town',
    is_available: true,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1772458251839-cbd3ef8b7018?w=800&h=600&fit=crop&auto=format',
    created_at: '2024-03-10T13:00:00Z'
  },
  {
    id: '5',
    name: 'Kung Pao Chicken',
    description: 'Spicy stir-fried chicken with peanuts, vegetables, and chili peppers',
    price: 12.99,
    category: 'Main Course',
    restaurant_name: 'Dragon Palace',
    is_available: true,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop',
    created_at: '2024-03-10T14:00:00Z'
  },
  {
    id: '6',
    name: 'Spaghetti Carbonara',
    description: 'Classic Roman pasta with eggs, cheese, and pancetta',
    price: 13.99,
    category: 'Pasta',
    restaurant_name: 'Pasta Paradise',
    is_available: false,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
    created_at: '2024-03-10T15:00:00Z'
  },
]

const categories = ['All', 'Pizza', 'Burgers', 'Rolls', 'Tacos', 'Main Course', 'Pasta', 'Appetizers', 'Desserts']

export function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [restaurantFilter, setRestaurantFilter] = useState('all')

  useEffect(() => {
    // Simulate loading menu items
    setTimeout(() => {
      setMenuItems(mockMenuItems)
      setFilteredItems(mockMenuItems)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = menuItems

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.restaurant_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

    // Filter by restaurant
    if (restaurantFilter !== 'all') {
      filtered = filtered.filter(item => item.restaurant_name === mockRestaurants.find(r => r.id === restaurantFilter)?.name)
    }

    setFilteredItems(filtered)
  }, [menuItems, searchQuery, categoryFilter, restaurantFilter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Menu Items</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={restaurantFilter} onValueChange={setRestaurantFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by restaurant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Restaurants</SelectItem>
                  {mockRestaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>All Menu Items</span>
            <Badge variant="outline">{filteredItems.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No menu items found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.restaurant_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(item.price)}</TableCell>
                      <TableCell>
                        <Badge className={item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.is_featured ? (
                          <Badge className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3" />
                            Featured
                          </Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(item.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Item
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
