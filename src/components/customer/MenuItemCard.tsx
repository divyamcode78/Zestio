import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { MenuItem, Restaurant } from '@/types/database'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

interface MenuItemCardProps {
  item: MenuItem
  restaurant: Restaurant
}

export function MenuItemCard({ item, restaurant }: MenuItemCardProps) {
  const { addItem, items, updateQuantity, removeItem } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)
  
  const cartItem = items.find((i) => i.menu_item_id === (item.id || item.$id))
  const quantity = cartItem?.quantity || 0
  const MAX_QUANTITY = 5

  const handleIncreaseQuantity = async () => {
    if (quantity >= MAX_QUANTITY) return
    
    setIsUpdating(true)
    try {
      if (quantity === 0) {
        // Add new item to cart
        await addItem(item, restaurant)
      } else {
        // Update existing item quantity
        await updateQuantity(cartItem!.id || cartItem!.$id, quantity + 1)
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setTimeout(() => setIsUpdating(false), 300)
    }
  }

  const handleDecreaseQuantity = async () => {
    if (quantity === 0) return
    
    setIsUpdating(true)
    try {
      if (quantity === 1) {
        // Remove item from cart
        await removeItem(cartItem!.id || cartItem!.$id)
      } else {
        // Decrease quantity
        await updateQuantity(cartItem!.id || cartItem!.$id, quantity - 1)
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setTimeout(() => setIsUpdating(false), 300)
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-sm">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-start gap-2">
              <h4 className="font-medium leading-tight">{item.name}</h4>
              {item.is_featured && (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            <p className="font-medium text-accent">{formatCurrency(item.price)}</p>
          </div>
          <div className="relative shrink-0">
            {item.image_url ? (
              <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-muted">
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/5">
                <span className="text-2xl font-bold text-accent/30">{item.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
            
            {/* Quantity Controls */}
            <div className="absolute -bottom-2 -right-2 flex items-center rounded-full bg-background shadow-md border">
              {quantity > 0 ? (
                <>
                  <Button
                    size="icon-sm"
                    className="h-7 w-7 rounded-l-full rounded-r-none border-r"
                    onClick={handleDecreaseQuantity}
                    disabled={!item.is_available || isUpdating}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="min-w-[20px] text-center text-xs font-semibold">
                    {quantity}
                  </span>
                  <Button
                    size="icon-sm"
                    className="h-7 w-7 rounded-r-full rounded-l-none border-l"
                    onClick={handleIncreaseQuantity}
                    disabled={!item.is_available || isUpdating || quantity >= MAX_QUANTITY}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <Button
                  size="icon-sm"
                  className="h-8 w-8 rounded-full"
                  onClick={handleIncreaseQuantity}
                  disabled={!item.is_available || isUpdating}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        {!item.is_available && (
          <div className="bg-muted px-4 py-2 text-center text-xs text-muted-foreground">
            Currently unavailable
          </div>
        )}
      </CardContent>
    </Card>
  )
}
