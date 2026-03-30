import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, Check, Crown, Star, Zap, Shield, Clock, Gift, HeadphonesIcon, Truck, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 299,
    originalPrice: 399,
    duration: 'per month',
    features: [
      'Free delivery on orders above ₹299',
      'Priority customer support',
      '15% off at select restaurants',
      'Early access to new features',
      'Exclusive member deals'
    ],
    popular: false,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: 799,
    originalPrice: 1197,
    duration: 'for 3 months',
    features: [
      'Free delivery on all orders',
      'Priority customer support',
      '20% off at select restaurants',
      'Early access to new features',
      'Exclusive member deals',
      '2 free delivery credits per month'
    ],
    popular: true,
    color: 'from-orange-600 to-red-600'
  },
  {
    id: 'annual',
    name: 'Annual',
    price: 2999,
    originalPrice: 4788,
    duration: 'for 12 months',
    features: [
      'Free delivery on all orders',
      'VIP customer support',
      '25% off at select restaurants',
      'Early access to new features',
      'Exclusive member deals',
      '5 free delivery credits per month',
      'Birthday special offers',
      'Premium restaurant access'
    ],
    popular: false,
    color: 'from-orange-700 to-red-700'
  }
]

const benefits = [
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'Unlimited free delivery on all orders'
  },
  {
    icon: Tag,
    title: 'Exclusive Discounts',
    description: 'Get up to 25% off at partner restaurants'
  },
  {
    icon: HeadphonesIcon,
    title: 'Priority Support',
    description: '24/7 dedicated customer support'
  },
  {
    icon: Clock,
    title: 'Early Access',
    description: 'Be first to try new restaurants and features'
  },
  {
    icon: Shield,
    title: 'Premium Protection',
    description: 'Order protection and refund guarantees'
  },
  {
    icon: Gift,
    title: 'Special Offers',
    description: 'Birthday treats and member-exclusive deals'
  }
]

export function ZestioPlusPage() {
  const [selectedPlan, setSelectedPlan] = useState('quarterly')
  const navigate = useNavigate()

  const handleSubscribe = (planId: string) => {
    // TODO: Implement subscription logic
    console.log(`Subscribing to ${planId} plan`)
    // Navigate to payment page or show success message
    navigate('/payment-success')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🍕</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Zestio</span>
            </Link>
            <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <Crown className="h-8 w-8 text-orange-500" />
            <span className="text-4xl font-bold tracking-tight">Zestio</span>
            <span className="text-2xl font-bold text-orange-500">+</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Elevate Your Food Delivery Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join Zestio+ and enjoy exclusive benefits, free delivery, and premium support
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <benefit.icon className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
              </div>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Plans */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'border-orange-500 shadow-xl' : 'border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center text-white font-bold text-xl mb-4`}>
                    {plan.name[0]}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">{plan.duration}</CardDescription>
                  <div className="mt-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                      <span className="text-lg text-gray-500 line-through">₹{plan.originalPrice}</span>
                    </div>
                    <div className="text-green-600 text-sm mt-1">
                      Save ₹{plan.originalPrice - plan.price}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold py-3`}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What is Zestio+?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Zestio+ is our premium membership program that offers exclusive benefits like free delivery, 
                  priority support, and special discounts at partner restaurants.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, you can cancel your Zestio+ subscription at any time. Your benefits will continue 
                  until the end of your current billing period.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do free delivery credits work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Free delivery credits are automatically applied to your eligible orders. 
                  Any unused credits expire at the end of each billing period.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
