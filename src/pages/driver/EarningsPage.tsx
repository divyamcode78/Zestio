import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { TrendingUp, Calendar, Truck, Target } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface EarningData {
  date: string
  amount: number
  deliveries: number
}

interface EarningsStats {
  totalEarnings: number
  thisMonth: number
  lastMonth: number
  totalDeliveries: number
  averagePerDelivery: number
  monthlyGrowth: number
}

export function EarningsPage() {
  const [stats, setStats] = useState<EarningsStats>({
    totalEarnings: 0,
    thisMonth: 0,
    lastMonth: 0,
    totalDeliveries: 0,
    averagePerDelivery: 0,
    monthlyGrowth: 0,
  })
  const [earnings, setEarnings] = useState<EarningData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true)
      try {
        // Mock data for demo
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockStats: EarningsStats = {
          totalEarnings: 2847.50,
          thisMonth: 892.50,
          lastMonth: 756.25,
          totalDeliveries: 147,
          averagePerDelivery: 6.12,
          monthlyGrowth: 18.1,
        }

        const mockEarnings: EarningData[] = [
          { date: '2024-01-01', amount: 45.50, deliveries: 7 },
          { date: '2024-01-02', amount: 32.25, deliveries: 5 },
          { date: '2024-01-03', amount: 58.75, deliveries: 9 },
          { date: '2024-01-04', amount: 41.00, deliveries: 6 },
          { date: '2024-01-05', amount: 67.50, deliveries: 11 },
          { date: '2024-01-06', amount: 52.25, deliveries: 8 },
          { date: '2024-01-07', amount: 73.00, deliveries: 12 },
        ]

        setStats(mockStats)
        setEarnings(mockEarnings)
      } catch (error) {
        console.error('Failed to fetch earnings:', error)
        toast.error('Failed to load earnings data')
      } finally {
        setLoading(false)
      }
    }

    fetchEarnings()
  }, [timeRange])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Earnings</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Earnings</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.thisMonth)}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              Completed deliveries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Delivery</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averagePerDelivery.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Average earning per delivery
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {earnings.slice(0, 7).map((earning, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {new Date(earning.date).toLocaleDateString('en-IN', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {earning.deliveries} deliveries
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(earning.amount)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(earning.amount / earning.deliveries)} avg
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Best Day</p>
                <p className="text-sm text-muted-foreground">Highest earning day</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(73)}</p>
                <p className="text-sm text-muted-foreground">Jan 7</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Average Daily</p>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(stats.thisMonth / 30)}</p>
                <p className="text-sm text-muted-foreground">Per day</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Goal Progress</p>
                <p className="text-sm text-muted-foreground">Monthly target</p>
              </div>
              <div className="text-right">
                <p className="font-medium">89.3%</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(1000)} goal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Next Payout Date</p>
              <p className="text-lg font-semibold">Jan 15, 2024</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-lg font-semibold">{formatCurrency(stats.thisMonth)}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="text-lg font-semibold">Bank Transfer</p>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1">
              Download Statement
            </Button>
            <Button className="flex-1">
              Update Payment Info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
