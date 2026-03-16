import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Truck, CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react'

interface DeliveryStats {
  totalDeliveries: number
  completedDeliveries: number
  totalEarnings: number
  averageRating: number
  activeDeliveries: number
}

export function DriverDashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<DeliveryStats>({
    totalDeliveries: 0,
    completedDeliveries: 0,
    totalEarnings: 0,
    averageRating: 0,
    activeDeliveries: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching driver stats
    const fetchStats = async () => {
      setLoading(true)
      try {
        // Mock data for demo
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStats({
          totalDeliveries: 47,
          completedDeliveries: 45,
          totalEarnings: 892.50,
          averageRating: 4.8,
          activeDeliveries: 2,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        toast.error('Failed to load dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.name}!
          </p>
        </div>
        <Button>
          <Truck className="mr-2 h-4 w-4" />
          Go Online
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Excellent performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: '1', restaurant: 'Burger Palace', status: 'completed', time: '10 min ago' },
              { id: '2', restaurant: 'Pizza Roma', status: 'in-progress', time: '25 min ago' },
              { id: '3', restaurant: 'Sushi Master', status: 'completed', time: '1 hour ago' },
            ].map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{delivery.restaurant}</p>
                  <p className="text-sm text-muted-foreground">{delivery.time}</p>
                </div>
                <Badge variant={delivery.status === 'completed' ? 'default' : 'secondary'}>
                  {delivery.status === 'completed' ? (
                    <>
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Clock className="mr-1 h-3 w-3" />
                      In Progress
                    </>
                  )}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Truck className="mr-2 h-4 w-4" />
              View Available Orders
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Earnings Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              Delivery History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
