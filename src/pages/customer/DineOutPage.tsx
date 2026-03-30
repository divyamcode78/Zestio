import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, Search, MapPin, Star, Clock, Filter, Utensils, IndianRupee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const mumbaiRestaurants = [
  {
    id: 1,
    name: 'Bade Miyan',
    cuisine: 'Mughlai',
    rating: 4.5,
    deliveryTime: '30-40 min',
    priceRange: '₹300-600',
    image: '🍛',
    area: 'Crawford Market',
    specialties: ['Biryani', 'Kebabs', 'Nihari']
  },
  {
    id: 2,
    name: 'Trishna',
    cuisine: 'Seafood',
    rating: 4.4,
    deliveryTime: '25-35 min',
    priceRange: '₹400-800',
    image: '🦐',
    area: 'Kala Ghoda',
    specialties: ['Crab', 'Prawns', 'Fish Curry']
  },
  {
    id: 3,
    name: 'Leopold Cafe',
    cuisine: 'Continental',
    rating: 4.3,
    deliveryTime: '20-30 min',
    priceRange: '₹200-500',
    image: '☕',
    area: 'Colaba',
    specialties: ['Sandwiches', 'Coffee', 'Pastries']
  },
  {
    id: 4,
    name: 'Cafe Mondegar',
    cuisine: 'Parsi',
    rating: 4.6,
    deliveryTime: '35-45 min',
    priceRange: '₹250-450',
    image: '🥘',
    area: 'Fort',
    specialties: ['Berry Pulao', 'Sali Boti', 'Dhansak']
  },
  {
    id: 5,
    name: 'Britannia & Co.',
    cuisine: 'Parsi',
    rating: 4.2,
    deliveryTime: '30-40 min',
    priceRange: '₹300-600',
    image: '🍽',
    area: 'Ballard Estate',
    specialties: ['Berry Pulao', 'Mutton Cutlets', 'Caramel Custard']
  },
  {
    id: 6,
    name: 'Mahesh Lunch Home',
    cuisine: 'Maharashtrian',
    rating: 4.7,
    deliveryTime: '15-25 min',
    priceRange: '₹150-300',
    image: '🍱',
    area: 'Fort',
    specialties: ['Thali', 'Vada Pav', 'Misal Pav']
  },
  {
    id: 7,
    name: 'Gajale',
    cuisine: 'Seafood',
    rating: 4.5,
    deliveryTime: '25-35 min',
    priceRange: '₹500-1200',
    image: '🦐',
    area: 'Kala Ghoda',
    specialties: ['Tandoori Pomfret', 'Mangalorean Curry', 'Crab']
  },
  {
    id: 8,
    name: 'Peshawri',
    cuisine: 'North Indian',
    rating: 4.1,
    deliveryTime: '30-45 min',
    priceRange: '₹350-700',
    image: '🍖',
    area: 'CST',
    specialties: ['Kebabs', 'Biryani', 'Korma']
  },
  {
    id: 9,
    name: 'Shree Thaker Bhojanalaya',
    cuisine: 'Gujarati',
    rating: 4.3,
    deliveryTime: '25-35 min',
    priceRange: '₹200-400',
    image: '🍛',
    area: 'Matunga',
    specialties: ['Thali', 'Fafda', 'Jalebi']
  }
]

const cuisineTypes = ['All', 'Mughlai', 'Seafood', 'Continental', 'Parsi', 'Maharashtrian', 'North Indian', 'Gujarati']

export function DineOutPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All')
  const navigate = useNavigate()

  const filteredRestaurants = mumbaiRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.area.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine
    return matchesSearch && matchesCuisine
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center space-x-2 bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent hover:text-black focus:text-black active:text-black">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <Utensils className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Restaurants in Mumbai</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the best dining experiences Mumbai has to offer - from iconic heritage restaurants
            to modern culinary hotspots
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search restaurants or areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Cuisine Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {cuisineTypes.map((cuisine) => (
            <Badge
              key={cuisine}
              variant={selectedCuisine === cuisine ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCuisine(cuisine)}
            >
              {cuisine}
            </Badge>
          ))}
        </div>

        {/* Restaurant Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredRestaurants.length}</span> restaurants in Mumbai
          </p>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2">{restaurant.image}</div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {restaurant.deliveryTime}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                <CardDescription className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-3 w-3 mr-1" />
                  {restaurant.area} • {restaurant.cuisine}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">{restaurant.priceRange}</span>
                  <Badge variant="secondary" className="text-xs">
                    {restaurant.cuisine}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Specialties:</span> {restaurant.specialties.join(', ')}
                  </p>
                </div>
                <Button
                  className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                >
                  View Menu
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No restaurants found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
