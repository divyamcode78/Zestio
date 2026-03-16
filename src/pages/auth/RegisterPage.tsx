import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ShoppingBag, Store, Truck, ArrowRight, Eye, EyeOff, User, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/context/AuthContext'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<'name' | 'email' | 'password' | null>(null)

  const handleCustomerSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await register(email, password, name, 'customer')
      toast.success('Account created successfully!')
      
      setTimeout(() => {
        navigate('/')
      }, 500)
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const getAnimatedIcon = () => {
    switch (focusedField) {
      case 'name':
        return <User className="h-6 w-6 animate-pulse" />
      case 'email':
        return <Mail className="h-6 w-6 animate-pulse" />
      case 'password':
        return <Lock className="h-6 w-6 animate-pulse" />
      default:
        return <ShoppingBag className="h-6 w-6 transition-all duration-300" />
    }
  }

  const getIconBackground = () => {
    switch (focusedField) {
      case 'name':
        return 'bg-purple-500 text-white'
      case 'email':
        return 'bg-blue-500 text-white'
      case 'password':
        return 'bg-green-500 text-white'
      default:
        return 'bg-accent text-accent-foreground'
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 transform hover:scale-110 ${getIconBackground()}`}>
            {getAnimatedIcon()}
          </div>
          <CardTitle className="text-2xl">Join Zestio</CardTitle>
          <CardDescription>Order delicious food or start your business journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Signup Form */}
          <form onSubmit={handleCustomerSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                required
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  minLength={8}
                  autoComplete="new-password"
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner className="mr-2" /> : null}
              Create Customer Account
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">OR</span>
            </div>
          </div>

          {/* Partner Signup Buttons */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto py-4"
              onClick={() => navigate('/signup/restaurant')}
            >
              <Store className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Become Restaurant Partner</div>
                <div className="text-xs text-muted-foreground">Manage your restaurant and menu</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-auto py-4"
              onClick={() => navigate('/signup/delivery')}
            >
              <Truck className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Become Delivery Partner</div>
                <div className="text-xs text-muted-foreground">Deliver orders and earn money</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-accent hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
