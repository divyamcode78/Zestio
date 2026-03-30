import { Link, useNavigate } from 'react-router'
import { ArrowLeft, Cookie, Settings, Shield, Info, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function CookiePolicyPage() {
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
          <Cookie className="h-16 w-16 text-orange-500 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">Cookie Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-orange-500" />
                <span>What Are Cookies?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Cookies are small text files that are stored on your device when you visit websites. 
                They help us enhance your experience by remembering your preferences and improving our services.
              </p>
              <p className="text-gray-600">
                Cookies are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-orange-500" />
                <span>Types of Cookies We Use</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Essential Cookies</h4>
                <p className="text-gray-600">
                  These cookies are necessary for the website to function and cannot be switched off in our systems.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>User authentication and session management</li>
                  <li>Shopping cart functionality</li>
                  <li>Security and fraud prevention</li>
                  <li>Load balancing</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Performance Cookies</h4>
                <p className="text-gray-600">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Analytics and usage statistics</li>
                  <li>Website performance monitoring</li>
                  <li>Error tracking and debugging</li>
                  <li>A/B testing</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Functional Cookies</h4>
                <p className="text-gray-600">
                  These cookies enable enhanced functionality and personalization, such as videos and live chats.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Remembering your preferences</li>
                  <li>Language and region settings</li>
                  <li>Customized content delivery</li>
                  <li>Saved addresses and payment methods</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Marketing Cookies</h4>
                <p className="text-gray-600">
                  These cookies are used to track visitors across websites to display relevant advertisements.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Personalized ads and offers</li>
                  <li>Social media integration</li>
                  <li>Retargeting campaigns</li>
                  <li>Cross-site tracking</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-orange-500" />
                <span>Cookie Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We take appropriate security measures to protect your data and ensure the security of cookies.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>HTTPS encryption for all cookie transmissions</li>
                <li>Secure cookie flags (HttpOnly, Secure)</li>
                <li>Regular security audits</li>
                <li>Compliance with data protection regulations</li>
                <li>Limited cookie retention periods</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-orange-500" />
                <span>Managing Your Cookie Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                You have several options to manage cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Browser settings to block or delete cookies</li>
                <li>Cookie consent banner on our website</li>
                <li>Privacy settings in your account</li>
                <li>Opt-out of marketing cookies</li>
                <li>Third-party cookie controls</li>
              </ul>
              <p className="text-gray-600">
                Note that disabling certain cookies may affect the functionality of our website.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We use third-party services that may set their own cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Payment processors (Razorpay, PayTM)</li>
                <li>Analytics services (Google Analytics)</li>
                <li>Social media platforms</li>
                <li>Advertising partners</li>
                <li>Mapping services (Google Maps)</li>
              </ul>
              <p className="text-gray-600">
                These third parties have their own privacy policies and cookie policies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookie Duration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Different cookies have different lifespans:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Session cookies: Deleted when you close your browser</li>
                <li>Persistent cookies: Remain for a set period (typically 30 days to 1 year)</li>
                <li>Authentication cookies: Usually last for your session duration</li>
                <li>Preference cookies: Typically last 6 months to 1 year</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Under data protection laws, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Know what cookies are being used</li>
                <li>Accept or reject non-essential cookies</li>
                <li>Withdraw consent at any time</li>
                <li>Request information about stored data</li>
                <li>Delete your data and cookies</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                If you have any questions about our Cookie Policy, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">
                  <strong>Email:</strong> privacy@zestio.com
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
