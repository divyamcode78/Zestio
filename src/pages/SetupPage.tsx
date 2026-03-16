import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ShoppingBag, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isAppwriteConfigured } from '@/lib/appwrite'

export function SetupPage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(false)
  const isConfigured = isAppwriteConfigured()

  const handleCheckConfiguration = () => {
    setChecking(true)
    // Force a page reload to re-check environment variables
    window.location.reload()
  }

  if (isConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Appwrite Connected</CardTitle>
            <CardDescription>Your Appwrite configuration is ready. You can now proceed to use the app.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/login')}>
              Continue to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Zestio</h1>
          <p className="mt-2 text-muted-foreground">
            Complete the setup to start using the food delivery platform
          </p>
        </div>

        {/* Setup Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg">Appwrite Configuration Required</CardTitle>
            </div>
            <CardDescription>
              This app requires Appwrite for authentication and database. Follow the steps below to configure it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-2">
              <h3 className="font-medium">Step 1: Create an Appwrite Project</h3>
              <p className="text-sm text-muted-foreground">
                Go to Appwrite Cloud and create a new project for Zestio.
              </p>
              <Button variant="outline" asChild>
                <a href="https://cloud.appwrite.io" target="_blank" rel="noopener noreferrer">
                  Open Appwrite Cloud
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <h3 className="font-medium">Step 2: Add Web Platform</h3>
              <p className="text-sm text-muted-foreground">
                In your Appwrite project, go to Settings {'>'} Platforms and add a Web platform with hostname{' '}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">localhost</code>
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <h3 className="font-medium">Step 3: Create Database and Collections</h3>
              <p className="text-sm text-muted-foreground">
                Create a database named <code className="rounded bg-muted px-1 py-0.5 text-xs">zestio_db</code> and add
                the following collections: users, restaurants, menu_items, cart_items, orders, order_items, payments,
                delivery_locations, reviews.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <h3 className="font-medium">Step 4: Add Environment Variables</h3>
              <p className="text-sm text-muted-foreground">
                Add these environment variables to your project:
              </p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="endpoint">VITE_APPWRITE_ENDPOINT</Label>
                  <Input id="endpoint" placeholder="https://cloud.appwrite.io/v1" readOnly className="bg-muted" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="projectId">VITE_APPWRITE_PROJECT_ID</Label>
                  <Input id="projectId" placeholder="your-project-id" readOnly className="bg-muted" />
                </div>
              </div>
            </div>

            {/* Check Button */}
            <Button className="w-full" onClick={handleCheckConfiguration} disabled={checking}>
              {checking ? 'Checking...' : 'Check Configuration'}
            </Button>
          </CardContent>
        </Card>

        {/* Demo Mode Note */}
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-muted-foreground">
              For demo purposes, you can also run Appwrite locally using Docker.{' '}
              <a
                href="https://appwrite.io/docs/self-hosting"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Learn more
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
