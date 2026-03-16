import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { ArrowLeft, Star, Clock, MapPin, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MenuItemCard } from '@/components/customer/MenuItemCard'
import { databases, DATABASE_ID, COLLECTIONS, Query, isAppwriteConfigured } from '@/lib/appwrite'
import { mockRestaurants } from '@/lib/mockData'
import type { Restaurant, MenuItem } from '@/types/database'
import { formatCurrency } from '@/lib/utils'

// Unique menu items for each restaurant
const restaurantMenus: Record<string, MenuItem[]> = {
  '1': [ // Pizza Paradise
    {
      $id: '1',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '1',
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, basil, and tomato sauce on our classic dough',
      price: 12.99,
      category: 'Pizza',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: true,
    },
    {
      $id: '2',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '1',
      name: 'Pepperoni Feast',
      description: 'Double pepperoni with extra cheese and our signature tomato sauce',
      price: 14.99,
      category: 'Pizza',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
    {
      $id: '3',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '1',
      name: 'Garlic Bread',
      description: 'Toasted garlic bread with herbs and melted butter',
      price: 5.99,
      category: 'Appetizers',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
    {
      $id: '4',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '1',
      name: 'Caesar Salad',
      description: 'Romaine lettuce, parmesan, croutons, and caesar dressing',
      price: 8.99,
      category: 'Salads',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: true,
    },
    {
      $id: '5',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '1',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
      price: 6.99,
      category: 'Desserts',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
  ],
  '2': [ // Burger Barn
    {
      $id: '6',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '2',
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty with melted cheese, lettuce, tomato, and our special sauce',
      price: 10.99,
      category: 'Burgers',
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: true,
    },
    {
      $id: '7',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '2',
      name: 'Bacon Deluxe',
      description: 'Double patty with crispy bacon, cheddar cheese, and BBQ sauce',
      price: 13.99,
      category: 'Burgers',
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
    {
      $id: '8',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '2',
      name: 'Crispy Fries',
      description: 'Golden crispy fries with sea salt',
      price: 4.99,
      category: 'Sides',
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
    {
      $id: '9',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '2',
      name: 'Onion Rings',
      description: 'Crispy battered onion rings served with ranch dip',
      price: 5.99,
      category: 'Sides',
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: true,
    },
    {
      $id: '10',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '2',
      name: 'Chocolate Milkshake',
      description: 'Thick and creamy chocolate milkshake',
      price: 6.99,
      category: 'Beverages',
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
  ],
  '3': [ // Sushi Sensation
    {
      $id: '11',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '3',
      name: 'California Roll',
      description: 'Crab, avocado, and cucumber rolled with sesame seeds',
      price: 8.99,
      category: 'Rolls',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: true,
    },
    {
      $id: '12',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '3',
      name: 'Spicy Tuna Roll',
      description: 'Fresh tuna with spicy mayo and cucumber',
      price: 10.99,
      category: 'Rolls',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
    {
      $id: '13',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '3',
      name: 'Miso Soup',
      description: 'Traditional Japanese soup with tofu and seaweed',
      price: 3.99,
      category: 'Appetizers',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
    {
      $id: '14',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '3',
      name: 'Edamame',
      description: 'Steamed soybeans with sea salt',
      price: 4.99,
      category: 'Appetizers',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: true,
    },
    {
      $id: '15',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '3',
      name: 'Green Tea Ice Cream',
      description: 'Authentic Japanese green tea ice cream',
      price: 5.99,
      category: 'Desserts',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
  ],
  '4': [ // Taco Town
    {
      $id: '16',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '4',
      name: 'Classic Beef Taco',
      description: 'Seasoned beef with lettuce, cheese, and salsa in a corn tortilla',
      price: 3.99,
      category: 'Tacos',
      image_url: 'https://images.unsplash.com/photo-1772458251839-cbd3ef8b7018?w=800&h=600&fit=crop&auto=format',
      is_available: true,
      is_featured: true,
    },
    {
      $id: '17',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '4',
      name: 'Chicken Tinga Taco',
      description: 'Shredded chicken in chipotle sauce with onions and cilantro',
      price: 4.49,
      category: 'Tacos',
      image_url: 'https://images.unsplash.com/photo-1772458251839-cbd3ef8b7018?w=800&h=600&fit=crop&auto=format',
      is_available: true,
      is_featured: false,
    },
    {
      $id: '18',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '4',
      name: 'Quesadilla',
      description: 'Grilled flour tortilla with cheese and your choice of filling',
      price: 6.99,
      category: 'Appetizers',
      image_url: 'https://images.unsplash.com/photo-1772458251839-cbd3ef8b7018?w=800&h=600&fit=crop&auto=format',
      is_available: true,
      is_featured: true,
    },
    {
      $id: '19',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '4',
      name: 'Nachos Supreme',
      description: 'Crispy tortilla chips with cheese, jalapeños, sour cream, and guacamole',
      price: 8.99,
      category: 'Appetizers',
      image_url: 'https://images.unsplash.com/photo-1772458251839-cbd3ef8b7018?w=800&h=600&fit=crop&auto=format',
      is_available: true,
      is_featured: false,
    },
    {
      $id: '20',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '4',
      name: 'Horchata',
      description: 'Traditional Mexican rice drink with cinnamon',
      price: 3.99,
      category: 'Beverages',
      image_url: 'https://images.unsplash.com/photo-1772458251839-cbd3ef8b7018?w=800&h=600&fit=crop&auto=format',
      is_available: true,
      is_featured: false,
    },
  ],
  '5': [ // Dragon Palace
    {
      $id: '21',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '5',
      name: 'Kung Pao Chicken',
      description: 'Spicy stir-fried chicken with peanuts, vegetables, and chili peppers',
      price: 12.99,
      category: 'Main Course',
      image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: true,
    },
    {
      $id: '22',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '5',
      name: 'Sweet and Sour Pork',
      description: 'Crispy pork in tangy sweet and sour sauce with pineapple and peppers',
      price: 11.99,
      category: 'Main Course',
      image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
    {
      $id: '23',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '5',
      name: 'Spring Rolls',
      description: 'Crispy vegetable spring rolls served with sweet chili sauce',
      price: 5.99,
      category: 'Appetizers',
      image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: true,
    },
    {
      $id: '24',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '5',
      name: 'Fried Rice',
      description: 'Steamed rice stir-fried with eggs, vegetables, and soy sauce',
      price: 8.99,
      category: 'Main Course',
      image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
    {
      $id: '25',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '5',
      name: 'Fortune Cookies',
      description: 'Traditional crispy cookies with paper fortunes inside',
      price: 2.99,
      category: 'Desserts',
      image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
  ],
  '6': [ // Pasta Paradise
    {
      $id: '26',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '6',
      name: 'Spaghetti Carbonara',
      description: 'Classic Roman pasta with eggs, cheese, and pancetta',
      price: 13.99,
      category: 'Pasta',
      image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: true,
    },
    {
      $id: '27',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '6',
      name: 'Fettuccine Alfredo',
      description: 'Rich and creamy alfredo sauce with fettuccine pasta',
      price: 12.99,
      category: 'Pasta',
      image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
    {
      $id: '28',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '6',
      name: 'Bruschetta',
      description: 'Toasted bread with tomatoes, garlic, and fresh basil',
      price: 6.99,
      category: 'Appetizers',
      image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: true,
    },
    {
      $id: '29',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '6',
      name: 'Caesar Salad',
      description: 'Romaine lettuce, parmesan, croutons, and caesar dressing',
      price: 8.99,
      category: 'Salads',
      image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
    {
      $id: '30',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $collectionId: COLLECTIONS.MENU_ITEMS,
      $databaseId: DATABASE_ID,
      restaurant_id: '6',
      name: 'Panna Cotta',
      description: 'Silky Italian dessert with vanilla and caramel sauce',
      price: 6.99,
      category: 'Desserts',
      image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
      is_available: true,
      is_featured: false,
    },
  ],
}

export function RestaurantPage() {
  const { id } = useParams<{ id: string }>()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)

      if (!isAppwriteConfigured() || !id) {
        // Use mock data - find the restaurant by ID
        const foundRestaurant = mockRestaurants.find(r => r.$id === id)
        if (foundRestaurant) {
          setRestaurant(foundRestaurant)
          setMenuItems(restaurantMenus[id] || [])
        } else {
          setRestaurant(null)
          setMenuItems([])
        }
        setIsLoading(false)
        return
      }

      try {
        // Fetch restaurant
        const restaurantDoc = await databases.getDocument(DATABASE_ID, COLLECTIONS.RESTAURANTS, id)
        setRestaurant(restaurantDoc as Restaurant)

        // Fetch menu items
        const menuResponse = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MENU_ITEMS, [
          Query.equal('restaurant_id', id),
          Query.orderAsc('category'),
        ])
        setMenuItems(menuResponse.documents as MenuItem[])
      } catch (error) {
        console.error('Failed to fetch restaurant data:', error)
        // Fallback to mock data
        const foundRestaurant = mockRestaurants.find(r => r.$id === id)
        if (foundRestaurant) {
          setRestaurant(foundRestaurant)
          setMenuItems(restaurantMenus[id] || [])
        } else {
          setRestaurant(null)
          setMenuItems([])
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="aspect-[21/9] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium">Restaurant not found</p>
        <Button asChild className="mt-4">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  const categories = ['All', ...new Set(menuItems.map((item) => item.category))]
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter((item) => item.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>

      {/* Restaurant Header */}
      <div className="relative aspect-[21/9] overflow-hidden rounded-xl bg-muted">
        {restaurant.image_url ? (
          <img src={restaurant.image_url} alt={restaurant.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
            <span className="text-6xl font-bold text-accent/30">{restaurant.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Restaurant Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary">{restaurant.cuisine_type}</Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium text-foreground">{restaurant.rating.toFixed(1)}</span>
                <span>({restaurant.total_reviews} reviews)</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{restaurant.estimated_delivery_time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{formatCurrency(restaurant.delivery_fee)} delivery</span>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground">{restaurant.description}</p>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{restaurant.address}</span>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Menu</h2>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={selectedCategory} className="mt-4">
            {filteredItems.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No items in this category</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredItems.map((item) => (
                  <MenuItemCard key={item.$id} item={item} restaurant={restaurant} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
