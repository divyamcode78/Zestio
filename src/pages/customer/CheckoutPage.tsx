import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, MapPin, CreditCard, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency } from '@/lib/utils'
import { databases, DATABASE_ID, COLLECTIONS, ID, isAppwriteConfigured } from '@/lib/appwrite'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { groups, totalAmount, clearCart } = useCart()
  const { user, profile } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [instructions, setInstructions] = useState('')
  
  // Calculate delivery fees and taxes
  const calculateDeliveryFee = (distance: number) => {
    if (distance <= 10) {
      return 29 // Minimal fee for within 10km
    } else {
      return 49 // Higher fee for distances > 10km
    }
  }
  
  const calculateTaxes = (subtotal: number) => {
    const platformFee = subtotal * 0.02 // 2% platform fee
    const gst = subtotal * 0.18 // 18% GST
    return { platformFee, gst }
  }
  
  // Generate random delivery distances for each restaurant
  const generateRandomDistance = () => {
    return Math.floor(Math.random() * 20) + 1 // Random distance between 1-20 km
  }

  const handleProceedToPayment = () => {
    if (!address.trim()) {
      toast.error('Please enter a delivery address')
      return
    }
    if (!phone.trim()) {
      toast.error('Please enter a phone number')
      return
    }

    // Navigate to payment page with order data
    navigate('/payment', {
      state: {
        orderData: {
          address,
          phone,
          instructions,
        }
      }
    })
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <CreditCard className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-lg font-medium">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground">Add items to your cart to checkout</p>
        <Button asChild className="mt-4">
          <Link to="/">Browse Restaurants</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>

      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Delivery Info & Order Summary */}
        <div className="space-y-6 lg:col-span-2">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, Apt 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  placeholder="Ring doorbell, leave at door, etc."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Summary by Restaurant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {groups.map((group, index) => {
                const { platformFee, gst } = calculateTaxes(group.subtotal)
                const distance = generateRandomDistance() // Random distance for this order
                const deliveryFee = calculateDeliveryFee(distance)
                
                return (
                  <div key={group.restaurant_id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="space-y-3">
                      <h3 className="font-medium">{group.restaurant_name}</h3>
                      {group.items.map((item) => (
                        <div key={item.$id} className="flex justify-between text-sm">
                          <span>
                            {item.quantity}x {item.item_name}
                          </span>
                          <span>{formatCurrency(item.item_price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{formatCurrency(group.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Delivery fee ({distance} Km)</span>
                        <span>{formatCurrency(deliveryFee)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Platform fee (2%)</span>
                        <span>{formatCurrency(platformFee)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>GST (18%)</span>
                        <span>{formatCurrency(gst)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>{formatCurrency(group.subtotal + deliveryFee + platformFee + gst)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right: Payment Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {groups.map((group) => {
                const { platformFee, gst } = calculateTaxes(group.subtotal)
                const distance = generateRandomDistance() // Random distance for this order
                const deliveryFee = calculateDeliveryFee(distance)
                const groupTotal = group.subtotal + deliveryFee + platformFee + gst
                
                return (
                  <div key={group.restaurant_id} className="flex justify-between text-sm">
                    <span>{group.restaurant_name}</span>
                    <span>{formatCurrency(groupTotal)}</span>
                  </div>
                )
              })}
              
              {/* Fee Breakdown */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Platform Fee (2%)</span>
                  <span>{formatCurrency(groups.reduce((sum, group) => 
                    sum + calculateTaxes(group.subtotal).platformFee, 0))}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>GST (18%)</span>
                  <span>{formatCurrency(groups.reduce((sum, group) => 
                    sum + calculateTaxes(group.subtotal).gst, 0))}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Delivery Distance</span>
                  <span>{groups.map(group => {
                    const distance = generateRandomDistance()
                    return `${distance} km`
                  }).join(', ')}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(groups.reduce((sum, group) => {
                  const { platformFee, gst } = calculateTaxes(group.subtotal)
                  const distance = generateRandomDistance()
                  const deliveryFee = calculateDeliveryFee(distance)
                  return sum + group.subtotal + deliveryFee + platformFee + gst
                }, 0))}</span>
              </div>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleProceedToPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Spinner className="mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By placing your order, you agree to our terms of service
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
