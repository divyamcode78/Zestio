import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Search, MapPin, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { RestaurantCard } from '@/components/customer/RestaurantCard'
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

      // Always use mock data for now
      setRestaurants(mockRestaurants)
      setIsLoading(false)

      // Uncomment this when API is ready
      /*
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
      */
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
    <>
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
              {displayRestaurants.length} restaurant{displayRestaurants.length === 1 ? '' : 's'}
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

        {/* Zestio+ Section */}
        <section className="bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 space-y-8 py-16 px-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-4xl font-bold tracking-tight">Zestio</span>
              <span className="text-2xl font-bold text-orange-500">+</span>
            </div>
            <h2 className="text-2xl font-semibold">Premium Food Delivery Experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upgrade to Zestio+ and enjoy exclusive benefits like free delivery, priority support, 
              special discounts, and early access to new restaurants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free Delivery */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-8 border border-orange-200 shadow-lg">
              <div className="text-orange-600 mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-orange-800">Free Delivery</h3>
              <p className="text-orange-700 text-sm">
                Get unlimited free delivery on all orders above ₹299
              </p>
            </div>

            {/* Priority Support */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 border border-blue-200 shadow-lg">
              <div className="text-blue-600 mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536-3.536m0 5.656l3.536 3.536M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2v-4a2 2 0 012-2h4l2 2h2a2 2 0 012 2v4a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-blue-800">Priority Support</h3>
              <p className="text-blue-700 text-sm">
                Get 24/7 priority customer support with faster response times
              </p>
            </div>

            {/* Exclusive Discounts */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 border border-green-200 shadow-lg">
              <div className="text-green-600 mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 3-1.343 3-3-3m0 8c1.657 0 3-.895 3-2s-1.343-2-3-2-3-.895-3-3 3m0 8V5a2 2 0 00-2-2H9a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H9z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-green-800">Exclusive Discounts</h3>
              <p className="text-green-700 text-sm">
                Access member-only deals and up to 20% off at select restaurants
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/zestio-plus">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 shadow-lg">
                Upgrade to Zestio+
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
