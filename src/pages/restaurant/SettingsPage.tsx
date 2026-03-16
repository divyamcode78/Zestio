import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { databases, storage, DATABASE_ID, COLLECTIONS, STORAGE_BUCKET_ID } from '@/lib/appwrite'
import { ID } from 'appwrite'
import { Restaurant } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { ImagePlus, Save } from 'lucide-react'

interface RestaurantForm {
  name: string
  description: string
  cuisine_type: string
  address: string
  phone: string
  email: string
  image_url: string
  cover_image_url: string
  is_open: boolean
  min_order_amount: string
  delivery_fee: string
  estimated_delivery_time: string
  opening_hours: string
}

export default function SettingsPage() {
  const { profile } = useAuth()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<RestaurantForm>({
    name: '',
    description: '',
    cuisine_type: '',
    address: '',
    phone: '',
    email: '',
    image_url: '',
    cover_image_url: '',
    is_open: true,
    min_order_amount: '0',
    delivery_fee: '0',
    estimated_delivery_time: '30',
    opening_hours: '',
  })

  useEffect(() => {
    if (profile?.restaurant_id) {
      fetchRestaurant()
    }
  }, [profile?.restaurant_id])

  const fetchRestaurant = async () => {
    if (!profile?.restaurant_id) return

    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.RESTAURANTS,
        profile.restaurant_id
      )
      const rest = response as Restaurant
      setRestaurant(rest)
      setForm({
        name: rest.name || '',
        description: rest.description || '',
        cuisine_type: rest.cuisine_type || '',
        address: rest.address || '',
        phone: rest.phone || '',
        email: rest.email || '',
        image_url: rest.image_url || '',
        cover_image_url: rest.cover_image_url || '',
        is_open: rest.is_open ?? true,
        min_order_amount: rest.min_order_amount?.toString() || '0',
        delivery_fee: rest.delivery_fee?.toString() || '0',
        estimated_delivery_time: rest.estimated_delivery_time?.toString() || '30',
        opening_hours: rest.opening_hours || '',
      })
    } catch (error) {
      console.error('Error fetching restaurant:', error)
      toast.error('Failed to load restaurant settings')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'image_url' | 'cover_image_url'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const response = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file)
      const width = field === 'cover_image_url' ? 1200 : 400
      const height = field === 'cover_image_url' ? 400 : 400
      const url = storage.getFilePreview(STORAGE_BUCKET_ID, response.$id, width, height)
      setForm((prev) => ({ ...prev, [field]: url.href }))
      toast.success('Image uploaded')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!restaurant) return

    setSaving(true)
    try {
      const data = {
        name: form.name,
        description: form.description,
        cuisine_type: form.cuisine_type,
        address: form.address,
        phone: form.phone,
        email: form.email,
        image_url: form.image_url,
        cover_image_url: form.cover_image_url,
        is_open: form.is_open,
        min_order_amount: parseFloat(form.min_order_amount) || 0,
        delivery_fee: parseFloat(form.delivery_fee) || 0,
        estimated_delivery_time: parseInt(form.estimated_delivery_time) || 30,
        opening_hours: form.opening_hours,
      }

      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.RESTAURANTS,
        restaurant.$id,
        data
      )

      setRestaurant({ ...restaurant, ...data })
      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <Button onClick={handleSubmit} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Images</CardTitle>
            <CardDescription>
              Upload your logo and cover image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt="Logo"
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-muted">
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image_url')}
                    className="max-w-[200px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="space-y-2">
                  {form.cover_image_url ? (
                    <img
                      src={form.cover_image_url}
                      alt="Cover"
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-full items-center justify-center rounded-lg bg-muted">
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'cover_image_url')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your restaurant details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cuisine">Cuisine Type</Label>
                <Input
                  id="cuisine"
                  value={form.cuisine_type}
                  onChange={(e) => setForm((prev) => ({ ...prev, cuisine_type: e.target.value }))}
                  placeholder="e.g., Italian, Chinese, Mexican"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Tell customers about your restaurant..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Opening Hours</Label>
              <Input
                id="hours"
                value={form.opening_hours}
                onChange={(e) => setForm((prev) => ({ ...prev, opening_hours: e.target.value }))}
                placeholder="e.g., Mon-Fri: 9am-10pm, Sat-Sun: 10am-11pm"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Settings</CardTitle>
            <CardDescription>
              Configure delivery options and pricing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="min_order">Minimum Order ($)</Label>
                <Input
                  id="min_order"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.min_order_amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, min_order_amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery_fee">Delivery Fee ($)</Label>
                <Input
                  id="delivery_fee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.delivery_fee}
                  onChange={(e) => setForm((prev) => ({ ...prev, delivery_fee: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery_time">Est. Delivery Time (min)</Label>
                <Input
                  id="delivery_time"
                  type="number"
                  min="1"
                  value={form.estimated_delivery_time}
                  onChange={(e) => setForm((prev) => ({ ...prev, estimated_delivery_time: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>
              Control whether your restaurant accepts orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Restaurant Open</p>
                <p className="text-sm text-muted-foreground">
                  {form.is_open
                    ? 'Your restaurant is currently accepting orders'
                    : 'Your restaurant is currently closed'}
                </p>
              </div>
              <Switch
                checked={form.is_open}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_open: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
