import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { CreditCard, Smartphone, Wallet, Loader2, ArrowLeft, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'
import { createOrder, type OrderInput } from '@/lib/orderManager'

// Razorpay types
declare global {
  interface Window {
    Razorpay: any
  }
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  popular?: boolean
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'upi',
    name: 'UPI',
    icon: <Smartphone className="h-5 w-5" />,
    description: 'Pay using UPI apps like Google Pay, PhonePe, Paytm',
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: <CreditCard className="h-5 w-5" />,
    description: 'Visa, Mastercard, RuPay, and more',
    popular: true,
  },
  {
    id: 'cash',
    name: 'Cash on Delivery',
    icon: <Wallet className="h-5 w-5" />,
    description: 'Pay when your order arrives',
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    icon: <CreditCard className="h-5 w-5" />,
    description: 'Secure payment via Razorpay',
    popular: true,
  },
]

export function PaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { groups, totalAmount, clearCart } = useCart()
  const { user, profile } = useAuth()
  
  // Get order data from location state
  const orderData = location.state?.orderData || {
    address: '',
    phone: profile?.phone || '',
    instructions: '',
  }

  const [selectedMethod, setSelectedMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

  // Card details state
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [upiId, setUpiId] = useState('')

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const validateCardDetails = () => {
    const newErrors: Record<string, string> = {}

    if (selectedMethod === 'card') {
      if (!cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required'
      } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number'
      }

      if (!cardName.trim()) {
        newErrors.cardName = 'Cardholder name is required'
      }

      if (!cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required'
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
        newErrors.cardExpiry = 'Invalid expiry date (MM/YY)'
      }

      if (!cardCvv.trim()) {
        newErrors.cardCvv = 'CVV is required'
      } else if (!/^\d{3,4}$/.test(cardCvv)) {
        newErrors.cardCvv = 'Invalid CVV'
      }
    }

    if (selectedMethod === 'upi') {
      if (!upiId.trim()) {
        newErrors.upiId = 'UPI ID is required'
      } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(upiId)) {
        newErrors.upiId = 'Invalid UPI ID format (e.g., user@upi)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s/g, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s/g, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setCardNumber(formatCardNumber(value))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setCardExpiry(formatExpiry(value))
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setCardCvv(value.slice(0, 4))
  }

  const processPayment = async (paymentMethod: string) => {
    setPaymentLoading(true)

    try {
      if (paymentMethod === 'razorpay') {
        // Initialize Razorpay
        const options = {
          key: 'rzp_test_1DP5mmOlF5G5ag', // Test key - replace with your actual key
          amount: totalAmount * 100, // Amount in paise
          currency: 'INR',
          name: 'Zestio Food Delivery',
          description: `Payment for order from ${groups.map(g => g.restaurant_name).join(', ')}`,
          image: '/logo.png',
          handler: (response) => {
            // Razorpay success callback
            const paymentId = response.razorpay_payment_id
            completeOrder('razorpay', paymentId)
          },
          prefill: {
            name: profile?.name || '',
            email: user?.email || '',
            contact: orderData.phone || '',
          },
          notes: {
            address: orderData.address,
            restaurants: groups.map(g => g.restaurant_name).join(', '),
          },
          theme: {
            color: '#000000',
          },
          modal: {
            ondismiss: function () {
              setPaymentLoading(false)
              toast.info('Payment cancelled')
            },
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // Simulate other payment methods - clear cart first
        clearCart()
        await new Promise(resolve => setTimeout(resolve, 2000))
        const paymentId = `${paymentMethod.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        completeOrder(paymentMethod, paymentId)
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
      setPaymentLoading(false)
    }
  }

  const completeOrder = async (paymentMethod: string, paymentId: string) => {
    setIsProcessing(true)

    try {
      if (!user || !orderData) {
        throw new Error('Missing user or order data')
      }

      // Create order items from cart
      const orderItems = groups.flatMap(group => 
        group.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.item_price
        }))
      )

      // Debug logging
      console.log('PaymentPage - Groups:', groups)
      console.log('PaymentPage - OrderItems:', orderItems)

      // Create the order
      const orderInput: OrderInput = {
        customer_id: user.id.toString(),
        restaurant_id: '1', // Will be updated to use actual restaurant from cart
        restaurant_name: groups[0]?.restaurant_name || 'Restaurant',
        items: orderItems,
        subtotal: totalAmount - 3.99, // Subtract delivery fee
        delivery_fee: 3.99,
        total_amount: totalAmount,
        delivery_address: orderData.address,
        customer_name: user.name || 'Customer',
        customer_phone: orderData.phone,
        special_instructions: orderData.instructions
      }

      const order = createOrder(orderInput)

      // Clear cart immediately after successful payment
      await clearCart()
      
      toast.success('Order placed successfully!')
      
      // Redirect to order success page
      const navigationState = {
        orderId: order.$id,
        paymentMethod,
        paymentId: order.parent_checkout_id, // Use real payment ID from order
        totalAmount,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        deliveryAddress: order.delivery_address,
        items: orderItems,
      }
      
      console.log('PaymentPage - Navigation state:', navigationState)
      
      setTimeout(() => {
        navigate('/order-success', {
          state: navigationState
        })
      }, 1000)
    } catch (error) {
      console.error('Error completing order:', error)
      toast.error('Failed to complete order. Please try again.')
      setIsProcessing(false)
    }
  }

  const handlePayment = () => {
    if (!validateCardDetails()) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    processPayment(selectedMethod)
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <CreditCard className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-lg font-medium">No order to pay for</h2>
        <p className="text-sm text-muted-foreground">Please add items to your cart first</p>
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
        <Link to="/checkout">
          <ArrowLeft className="h-4 w-4" />
          Back to Checkout
        </Link>
      </Button>

      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Payment</h1>
        <Badge variant="secondary">Secure</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Payment Methods */}
        <div className="space-y-6 lg:col-span-2">
          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label
                      htmlFor={method.id}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      {method.icon}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{method.name}</span>
                          {method.popular && (
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Details Form */}
          {selectedMethod === 'card' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Card Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    className={errors.cardNumber ? 'border-red-500' : ''}
                  />
                  {errors.cardNumber && (
                    <p className="text-sm text-red-500">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className={errors.cardName ? 'border-red-500' : ''}
                  />
                  {errors.cardName && (
                    <p className="text-sm text-red-500">{errors.cardName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                    <Input
                      id="cardExpiry"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className={errors.cardExpiry ? 'border-red-500' : ''}
                    />
                    {errors.cardExpiry && (
                      <p className="text-sm text-red-500">{errors.cardExpiry}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCvv">CVV</Label>
                    <Input
                      id="cardCvv"
                      placeholder="123"
                      value={cardCvv}
                      onChange={handleCvvChange}
                      maxLength={4}
                      className={errors.cardCvv ? 'border-red-500' : ''}
                    />
                    {errors.cardCvv && (
                      <p className="text-sm text-red-500">{errors.cardCvv}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedMethod === 'upi' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">UPI Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className={errors.upiId ? 'border-red-500' : ''}
                  />
                  {errors.upiId && (
                    <p className="text-sm text-red-500">{errors.upiId}</p>
                  )}
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> You will receive a payment request on your UPI app after clicking "Pay Now".
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedMethod === 'cash' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cash on Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Payment Details</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Please keep exact change ready</li>
                        <li>• Our delivery partner will collect payment at delivery</li>
                        <li>• You can pay via cash or digital payment to the partner</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedMethod === 'razorpay' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Razorpay Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Secure Payment</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 256-bit SSL encryption</li>
                        <li>• PCI DSS compliant</li>
                        <li>• Multiple payment options (Card, UPI, Net Banking, Wallets)</li>
                        <li>• Instant payment confirmation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Delivery Address */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Delivery Address</p>
                <p className="text-sm text-muted-foreground">{orderData.address}</p>
                <p className="text-sm text-muted-foreground">{orderData.phone}</p>
              </div>

              <Separator />

              {/* Order Items */}
              <div className="space-y-3">
                {groups.map((group) => (
                  <div key={group.restaurant_id} className="space-y-2">
                    <p className="font-medium text-sm">{group.restaurant_name}</p>
                    {group.items.map((item) => (
                      <div key={item.id || item.$id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.quantity}x {item.item_name}
                        </span>
                        <span>{formatCurrency(item.item_price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Delivery fee</span>
                      <span>{formatCurrency(group.delivery_fee)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>

              {/* Pay Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handlePayment}
                disabled={paymentLoading || isProcessing}
              >
                {paymentLoading || isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay {formatCurrency(totalAmount)}
                  </>
                )}
              </Button>

              {/* Security Notice */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  <Check className="inline h-3 w-3 mr-1" />
                  Secured by 256-bit SSL encryption
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
