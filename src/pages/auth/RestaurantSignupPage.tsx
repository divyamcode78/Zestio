import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Store, Eye, EyeOff, CheckCircle, Users, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/context/AuthContext'
import { Badge } from '@/components/ui/badge'

export function RestaurantSignupPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    restaurantType: '',
    cuisine: '',
    phone: '',
    address: '',
    description: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const restaurantTypes = [
    { value: 'casual_dining', label: 'Casual Dining' },
    { value: 'fine_dining', label: 'Fine Dining' },
    { value: 'fast_food', label: 'Fast Food' },
    { value: 'cafe', label: 'Cafe' },
    { value: 'food_truck', label: 'Food Truck' },
  ]

  const cuisineTypes = [
    { value: 'indian', label: 'Indian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'italian', label: 'Italian' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'american', label: 'American' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'thai', label: 'Thai' },
    { value: 'mediterranean', label: 'Mediterranean' },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Register as restaurant owner with user type 'restaurant'
      await register(formData.email, formData.password, formData.name, 'restaurant')
      
      // Store additional restaurant details (in real app, this would be saved to database)
      localStorage.setItem('restaurantSignupData', JSON.stringify({
        restaurantName: formData.restaurantName,
        restaurantType: formData.restaurantType,
        cuisine: formData.cuisine,
        phone: formData.phone,
        address: formData.address,
        description: formData.description,
      }))
      
      toast.success('Restaurant account created successfully!')
      
      setTimeout(() => {
        navigate('/restaurant')
      }, 1000)
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Failed to create restaurant account')
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep === 1 && !formData.name && !formData.email && !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500 text-white">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Become a Restaurant Partner</h1>
          <p className="text-gray-600 mt-2">Join thousands of restaurants delivering with Zestio</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  currentStep >= step ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step}</span>
                  )}
                </div>
                {step < 3 && (
                  <div className={`h-1 w-16 ${
                    currentStep > step ? 'bg-red-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-16">
            <span className="text-sm text-gray-600">Personal Info</span>
            <span className="text-sm text-gray-600">Restaurant Details</span>
            <span className="text-sm text-gray-600">Review</span>
          </div>
        </div>

        {/* Form */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@restaurant.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          minLength={8}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          minLength={8}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Restaurant Information</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="restaurantName">Restaurant Name *</Label>
                    <Input
                      id="restaurantName"
                      name="restaurantName"
                      type="text"
                      placeholder="My Amazing Restaurant"
                      value={formData.restaurantName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="restaurantType">Restaurant Type *</Label>
                      <select
                        id="restaurantType"
                        name="restaurantType"
                        value={formData.restaurantType}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                        required
                      >
                        <option value="">Select restaurant type</option>
                        {restaurantTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cuisine">Primary Cuisine *</Label>
                      <select
                        id="cuisine"
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleInputChange}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                        required
                      >
                        <option value="">Select cuisine type</option>
                        {cuisineTypes.map((cuisine) => (
                          <option key={cuisine.value} value={cuisine.value}>
                            {cuisine.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Restaurant Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="123 Main Street, Mumbai, India"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Restaurant Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Tell customers about your restaurant, specialties, and what makes you unique..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Review Your Information</h2>
                  
                  <div className="space-y-4 rounded-lg bg-gray-50 p-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Personal Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {formData.name}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Password:</strong> {'*'.repeat(8)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Restaurant Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Restaurant Name:</strong> {formData.restaurantName}</p>
                        <p><strong>Type:</strong> {restaurantTypes.find(t => t.value === formData.restaurantType)?.label}</p>
                        <p><strong>Cuisine:</strong> {cuisineTypes.find(c => c.value === formData.cuisine)?.label}</p>
                        <p><strong>Phone:</strong> {formData.phone}</p>
                        <p><strong>Address:</strong> {formData.address}</p>
                        {formData.description && (
                          <p><strong>Description:</strong> {formData.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button type="button" onClick={nextStep}>
                    Next Step
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner className="mr-2" /> : null}
                    Create Restaurant Account
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Reach More Customers</h3>
            <p className="text-gray-600 text-sm mt-2">Get access to thousands of hungry customers looking for great food</p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Grow Your Business</h3>
            <p className="text-gray-600 text-sm mt-2">Increase your revenue with our delivery platform and analytics</p>
          </div>
          
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <CheckCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Easy Management</h3>
            <p className="text-gray-600 text-sm mt-2">Simple dashboard to manage orders, menu, and track performance</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-red-600 hover:text-red-700">
              Sign in
            </Link>
          </p>
          <div className="mt-4">
            <Badge variant="outline" className="text-red-600">
              Restaurant Partner Signup
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
