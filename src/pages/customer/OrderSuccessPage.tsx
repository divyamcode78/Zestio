import { Link, useNavigate, useLocation } from 'react-router'
import { useState } from 'react'
import { CheckCircle, ArrowLeft, Home, Receipt, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import { OrderReceipt } from '@/components/OrderReceipt'
import { useAuth } from '@/context/AuthContext'

interface OrderSuccessState {
  orderId: string
  paymentMethod: string
  paymentId: string
  totalAmount: number
  customerName?: string
  customerPhone?: string
  deliveryAddress?: string
  items?: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export function OrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [showReceipt, setShowReceipt] = useState(false)
  const state = location.state as OrderSuccessState

  if (!state) {
    navigate('/')
    return null
  }

  const { orderId, paymentMethod, paymentId, totalAmount, customerName, customerPhone, deliveryAddress, items } = state

  // Debug logging
  console.log('OrderSuccessPage - Items data:', items)
  console.log('OrderSuccessPage - Full state:', state)

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'card': return 'Credit/Debit Card'
      case 'upi': return 'UPI'
      case 'cash': return 'Cash on Delivery'
      case 'razorpay': return 'Razorpay'
      default: return method
    }
  }

  const estimatedDelivery = '30-45 minutes'

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      {/* Success Message */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-600">Order Placed Successfully!</h1>
          <p className="text-muted-foreground">Your order has been confirmed and will be delivered soon</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Order Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono font-medium">{orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{getPaymentMethodName(paymentMethod)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment ID</p>
                  <p className="font-mono text-sm">{paymentId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Estimated Delivery Time</p>
                  <p className="text-sm text-muted-foreground">Your order will arrive in</p>
                </div>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {estimatedDelivery}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="font-medium">Delivery Updates</p>
                <p className="text-sm text-muted-foreground">
                  You'll receive real-time updates about your order status via SMS and email.
                </p>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">
                    <strong>Next Steps:</strong> Your order is being prepared and will be picked up by our delivery partner soon.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      We've sent order confirmation to your email and phone
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Restaurant Preparation</p>
                    <p className="text-sm text-muted-foreground">
                      The restaurant is preparing your delicious food
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Out for Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Our delivery partner will pick up your order and head to your location
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Enjoy Your Meal!</p>
                    <p className="text-sm text-muted-foreground">
                      Your food arrives hot and fresh. Enjoy your meal!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Actions */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  If you have any questions about your order, we're here to help!
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Track Order
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setShowReceipt(true)}>
                    View Receipt
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-medium">Continue Shopping</p>
                <Button asChild className="w-full">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Browse Restaurants
                  </Link>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Thank you for choosing Zestio! 🍕
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Receipt Modal */}
      <OrderReceipt
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        orderData={{
          orderId,
          paymentMethod,
          paymentId,
          totalAmount,
          customerName: customerName || 'Customer',
          customerEmail: user?.email || 'customer@example.com',
          customerPhone: customerPhone || '+91 98765 43210',
          deliveryAddress: deliveryAddress || '123 Main Street, Mumbai, India',
          items: items && items.length > 0 ? items : [{
            name: 'Order items will appear here',
            quantity: 1,
            price: totalAmount - 3.99
          }]
        }}
      />
    </div>
  )
}
