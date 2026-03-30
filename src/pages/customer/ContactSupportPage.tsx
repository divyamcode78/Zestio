import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, Phone, Mail, MessageCircle, Clock, MapPin, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'

export function ContactSupportPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    orderId: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement actual support ticket API call
      // await supportAPI.createTicket(formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Support ticket created successfully! We\'ll get back to you soon.')
      navigate('/')
    } catch (error: any) {
      console.error('Support ticket error:', error)
      toast.error(error.message || 'Failed to create support ticket')
    } finally {
      setIsLoading(false)
    }
  }

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team instantly',
      action: 'Start Chat',
      available: 'Available 24/7'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      action: '+91 98765 43210',
      available: '9 AM - 9 PM IST'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email for detailed queries',
      action: 'support@zestio.com',
      available: 'Response within 24 hours'
    }
  ]

  const commonIssues = [
    'Order not delivered',
    'Wrong items delivered',
    'Payment issues',
    'Account problems',
    'Restaurant issues',
    'Delivery delay',
    'Refund request',
    'App technical issues'
  ]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link to="/order-success">
          <ArrowLeft className="h-4 w-4" />
          Back to Order
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Contact Form */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderId">Order ID (Optional)</Label>
                    <Input
                      id="orderId"
                      placeholder="ORD-123456"
                      value={formData.orderId}
                      onChange={(e) => handleInputChange('orderId', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your issue in detail..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Spinner className="mr-2" /> : null}
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Common Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Common Issues</CardTitle>
              <CardDescription>
                Quick links for frequently reported problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {commonIssues.map((issue, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto py-2 px-3 text-left"
                    onClick={() => handleInputChange('subject', issue)}
                  >
                    {issue}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Support Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Options</CardTitle>
              <CardDescription>
                Choose your preferred way to reach us
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {supportOptions.map((option, index) => (
                <div key={index} className="flex items-start space-x-3 rounded-lg border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <option.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{option.title}</h4>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-accent font-medium">{option.action}</span>
                      <Badge variant="secondary" className="text-xs">
                        {option.available}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Support Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Phone Support</span>
                <span className="text-muted-foreground">9 AM - 9 PM IST</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Live Chat</span>
                <span className="text-muted-foreground">24/7</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Email Response</span>
                <span className="text-muted-foreground">Within 24 hours</span>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, India</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For urgent issues with ongoing orders, please call our emergency hotline:
              </p>
              <Button variant="destructive" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Emergency Hotline: +91 98765 43210
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
