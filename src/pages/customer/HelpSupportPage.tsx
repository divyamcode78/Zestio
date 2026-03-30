import { Link, useNavigate } from 'react-router'
import { ArrowLeft, Phone, Mail, MessageSquare, HelpCircle, Clock, FileText, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const supportOptions = [
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with our support team instantly',
    action: 'Start Chat',
    available: '24/7'
  },
  {
    icon: Phone,
    title: 'Call Support',
    description: 'Speak with our customer care team',
    action: 'Call Now',
    available: '9 AM - 9 PM'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us an email and we\'ll respond within 24 hours',
    action: 'Send Email',
    available: '24/7'
  }
]

const commonIssues = [
  {
    icon: Clock,
    title: 'Order Delayed',
    solution: 'Track your order in real-time or contact support'
  },
  {
    icon: FileText,
    title: 'Payment Issues',
    solution: 'Check payment status or request refund'
  },
  {
    icon: User,
    title: 'Account Problems',
    solution: 'Update profile or reset password'
  }
]

export function HelpSupportPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          <HelpCircle className="h-16 w-16 text-orange-500 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help you with any questions or concerns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {supportOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <option.icon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-sm text-gray-500">
                  Available: {option.available}
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Common Issues</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commonIssues.map((issue, index) => (
              <Card key={index} className="bg-white">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <issue.icon className="h-8 w-8 text-orange-500" />
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{issue.solution}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Still Need Help?</CardTitle>
              <CardDescription>
                Our support team is available 24/7 to assist you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center space-x-6">
                <div className="text-center">
                  <Phone className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="font-semibold">1-800-ZESTIO</p>
                  <p className="text-sm text-gray-600">24/7 Support</p>
                </div>
                <div className="text-center">
                  <Mail className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="font-semibold">support@zestio.com</p>
                  <p className="text-sm text-gray-600">Email Support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
