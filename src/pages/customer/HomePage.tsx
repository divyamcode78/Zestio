import { useState, useEffect } from 'react'
import { Search, MapPin, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { RestaurantCard } from '@/components/customer/RestaurantCard'
import { Footer } from '@/components/Footer'
import { restaurantsAPI } from '@/lib/api'
import { mockRestaurants } from '@/lib/mockData'
import type { Restaurant } from '@/lib/mockData'

const cuisineTypes = ['All', 'American', 'Italian', 'Chinese', 'Mexican', 'Japanese', 'Indian', 'Thai']

export function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All')

  useEffect(() => {
    async function fetchRestaurants() {
      setIsLoading(true)
      
      try {
        const params: any = {}
        if (selectedCuisine !== 'All') {
          params.cuisine_type = selectedCuisine
        }
        if (searchQuery) {
          params.search = searchQuery
        }

        const response = await restaurantsAPI.getAll(params)
        setRestaurants(response.restaurants)
      } catch (error) {
        console.error('Failed to fetch restaurants:', error)
        // Fallback to mock data on error
        setRestaurants(mockRestaurants)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurants()
  }, [searchQuery, selectedCuisine])

  const filteredRestaurants = restaurants

  // Add client-side filtering as fallback
  const displayRestaurants = searchQuery 
    ? filteredRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine_type?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredRestaurants

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Delicious food,{' '}
            <span className="text-accent">delivered</span>
          </h1>
          <p className="text-muted-foreground">
            Order from your favorite restaurants and track your delivery in real-time
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Delivering to</span>
          <Button variant="link" className="h-auto p-0 text-foreground">
            Mumbai, India
          </Button>
        </div>
      </section>

      {/* Cuisine Filters */}
      <section>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {cuisineTypes.map((cuisine) => (
            <Badge
              key={cuisine}
              variant={selectedCuisine === cuisine ? 'default' : 'secondary'}
              className="cursor-pointer shrink-0 px-4 py-1.5"
              onClick={() => setSelectedCuisine(cuisine)}
            >
              {cuisine}
            </Badge>
          ))}
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {selectedCuisine === 'All' ? 'All Restaurants' : selectedCuisine}
          </h2>
          <span className="text-sm text-muted-foreground">
            {displayRestaurants.length} restaurants
          </span>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[16/10] rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : displayRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-medium">No restaurants found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id || restaurant.$id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
