import { Link } from 'react-router'
import { Star, Clock, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Restaurant } from '@/types/database'
import { formatCurrency } from '@/lib/utils'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link to={`/restaurant/${restaurant.$id || restaurant.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md hover:border-accent/30">
        <div className="relative aspect-[16/10] bg-muted">
          {restaurant.image_url ? (
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
              <span className="text-4xl font-bold text-accent/30">{restaurant.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
          {restaurant.is_featured && (
            <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">Featured</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight line-clamp-1">{restaurant.name}</h3>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">{restaurant.cuisine_type}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{restaurant.estimated_delivery_time}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />
                <span>{formatCurrency(restaurant.delivery_fee)} delivery</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
