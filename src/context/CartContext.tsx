import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { cartAPI } from '@/lib/api'
import { useAuth } from './AuthContext'
import type { CartItem, CartGroup, MenuItem, Restaurant } from '@/types/database'

interface CartContextType {
  items: CartItem[]
  groups: CartGroup[]
  isLoading: boolean
  itemCount: number
  totalAmount: number
  addItem: (menuItem: MenuItem, restaurant: Restaurant) => Promise<void>
  removeItem: (itemId: string | number) => Promise<void>
  updateQuantity: (itemId: string | number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  clearRestaurantItems: (restaurantId: string | number) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [useLocalStorage, setUseLocalStorage] = useState(false)

  // Load cart from localStorage on mount or when API fails
  const loadFromLocalStorage = useCallback(() => {
    const savedCart = localStorage.getItem('zestio_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to parse saved cart:', error)
        setItems([])
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (useLocalStorage) {
      localStorage.setItem('zestio_cart', JSON.stringify(items))
    }
  }, [items, useLocalStorage])

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([])
      return
    }

    setIsLoading(true)
    try {
      const response = await cartAPI.get()
      setItems(response.cartItems || [])
      setUseLocalStorage(false) // API working, don't use localStorage
    } catch (error) {
      console.error('Failed to fetch cart from API, falling back to localStorage:', error)
      setUseLocalStorage(true) // API failed, use localStorage
      loadFromLocalStorage()
    } finally {
      setIsLoading(false)
    }
  }, [user, loadFromLocalStorage])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const groups: CartGroup[] = items.reduce((acc, item) => {
    const existingGroup = acc.find((g) => g.restaurant_id === item.restaurant_id)
    if (existingGroup) {
      existingGroup.items.push(item)
      existingGroup.subtotal += item.total_price || (item.item_price * item.quantity)
    } else {
      acc.push({
        restaurant_id: item.restaurant_id,
        restaurant_name: item.restaurant_name || 'Restaurant',
        items: [item],
        subtotal: item.total_price || (item.item_price * item.quantity),
        delivery_fee: 3.99, // Default delivery fee
      })
    }
    return acc
  }, [] as CartGroup[])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = groups.reduce((sum, group) => sum + group.subtotal + group.delivery_fee, 0)

  // Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

  const addItem = async (menuItem: MenuItem, restaurant: Restaurant) => {
    if (!user) {
      throw new Error('Please login to add items to cart')
    }

    try {
      await cartAPI.add(menuItem.id || menuItem.$id, 1)
      await fetchCart() // Refresh cart after adding
    } catch (error) {
      console.error('Failed to add item via API, using localStorage:', error)
      setUseLocalStorage(true)
      
      // Add item directly to localStorage
      const existingItem = items.find((i) => i.menu_item_id === (menuItem.id || menuItem.$id))
      
      if (existingItem) {
        // Update quantity of existing item
        const newQuantity = existingItem.quantity + 1
        await updateQuantity(existingItem.id || existingItem.$id, newQuantity)
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: generateId(),
          $id: generateId(),
          user_id: user.id.toString(),
          menu_item_id: menuItem.id || menuItem.$id,
          restaurant_id: restaurant.id || restaurant.$id,
          restaurant_name: restaurant.name,
          item_name: menuItem.name,
          item_price: menuItem.price,
          quantity: 1,
          total_price: menuItem.price,
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
          $collectionId: 'cart_items',
          $databaseId: 'zestio_db',
          $permissions: [],
        }
        setItems((prev) => [...prev, newItem])
      }
    }
  }

  const removeItem = async (itemId: string | number) => {
    try {
      await cartAPI.remove(itemId)
      setItems((prev) => prev.filter((item) => (item.id || item.$id) !== itemId))
    } catch (error) {
      console.error('Failed to remove item via API, using localStorage:', error)
      setUseLocalStorage(true)
      setItems((prev) => prev.filter((item) => (item.id || item.$id) !== itemId))
    }
  }

  const updateQuantity = async (itemId: string | number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId)
      return
    }

    try {
      await cartAPI.update(itemId, quantity)
      setItems((prev) => 
        prev.map((item) => {
          if ((item.id || item.$id) === itemId) {
            const updatedItem = { 
              ...item, 
              quantity, 
              total_price: item.item_price * quantity
            }
            return updatedItem
          }
          return item
        })
      )
    } catch (error) {
      console.error('Failed to update quantity via API, using localStorage:', error)
      setUseLocalStorage(true)
      setItems((prev) => 
        prev.map((item) => {
          if ((item.id || item.$id) === itemId) {
            const updatedItem = { 
              ...item, 
              quantity, 
              total_price: item.item_price * quantity,
              $updatedAt: new Date().toISOString()
            }
            return updatedItem
          }
          return item
        })
      )
    }
  }

  const clearCart = async () => {
    try {
      await cartAPI.clear()
      setItems([])
    } catch (error) {
      console.error('Failed to clear cart via API, using localStorage:', error)
      setUseLocalStorage(true)
      setItems([])
    }
  }

  const clearRestaurantItems = async (restaurantId: string | number) => {
    const restaurantItems = items.filter((item) => item.restaurant_id === restaurantId)
    try {
      await Promise.all(restaurantItems.map((item) => removeItem(item.id || item.$id)))
    } catch (error) {
      console.error('Failed to clear restaurant items:', error)
      throw error
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        groups,
        isLoading,
        itemCount,
        totalAmount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearRestaurantItems,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
