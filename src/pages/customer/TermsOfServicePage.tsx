import { Link, useNavigate } from 'react-router'
import { ArrowLeft, FileText, AlertTriangle, Users, Package, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function TermsOfServicePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4 mb-12">
          <FileText className="h-16 w-16 text-orange-500 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-orange-500" />
                <span>Acceptance of Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                By accessing and using Zestio, you accept and agree to be bound by the terms and 
                conditions of this agreement.
              </p>
              <p className="text-gray-600">
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-orange-500" />
                <span>Service Description</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Zestio is a food delivery platform that connects users with restaurants and delivery partners.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Food ordering and delivery services</li>
                <li>Restaurant discovery and reviews</li>
                <li>Payment processing</li>
                <li>Customer support</li>
                <li>Zestio+ premium membership</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>User Responsibilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                As a user of Zestio, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Provide accurate and complete information</li>
                <li>Maintain security of your account</li>
                <li>Use the service for personal, non-commercial purposes</li>
                <li>Not engage in fraudulent or illegal activities</li>
                <li>Respect restaurant staff and delivery partners</li>
                <li>Provide accurate delivery information</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-orange-500" />
                <span>Payment Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Payment for orders is processed through secure payment gateways.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Prices are displayed in Indian Rupees (₹)</li>
                <li>Additional delivery charges may apply</li>
                <li>Payment is processed at the time of ordering</li>
                <li>Refunds are subject to our refund policy</li>
                <li>Zestio+ membership fees are non-refundable</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Cancellation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Orders can be cancelled under the following conditions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Before restaurant confirms the order</li>
                <li>Cancellation charges may apply</li>
                <li>Refund processing time varies by payment method</li>
                <li>Zestio+ members may have different cancellation terms</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                All content, trademarks, and intellectual property on Zestio belong to Zestio Ltd.
              </p>
              <p className="text-gray-600">
                Users may not copy, reproduce, or distribute any content without explicit permission.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Zestio is not liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Food quality or restaurant operations</li>
                <li>Delivery delays due to external factors</li>
                <li>Loss of data or service interruptions</li>
                <li>Third-party service failures</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We reserve the right to terminate or suspend access to our service immediately, 
                without prior notice or liability, for any reason whatsoever.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">
                  <strong>Email:</strong> legal@zestio.com
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> 1-800-ZESTIO
                </p>
                <p className="text-gray-600">
                  <strong>Address:</strong> Mumbai, India
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
