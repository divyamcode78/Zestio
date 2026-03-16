import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { databases, storage, DATABASE_ID, COLLECTIONS, STORAGE_BUCKET_ID } from '@/lib/appwrite'
import { Query, ID } from 'appwrite'
import { MenuItem } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, ImagePlus } from 'lucide-react'

const categories = [
  'Appetizers',
  'Main Course',
  'Sides',
  'Desserts',
  'Beverages',
  'Specials',
]

interface MenuItemForm {
  name: string
  description: string
  price: string
  category: string
  image_url: string
  is_available: boolean
  prep_time_minutes: string
}

const initialForm: MenuItemForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  image_url: '',
  is_available: true,
  prep_time_minutes: '15',
}

export function MenuManagementPage() {
  const { profile } = useAuth()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [form, setForm] = useState<MenuItemForm>(initialForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (profile?.restaurant_id) {
      fetchMenuItems()
    }
  }, [profile?.restaurant_id])

  const fetchMenuItems = async () => {
    if (!profile?.restaurant_id) return
    
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MENU_ITEMS, [
        Query.equal('restaurant_id', profile.restaurant_id),
        Query.orderAsc('category'),
        Query.orderAsc('name'),
      ])
      setMenuItems(response.documents as MenuItem[])
    } catch (error) {
      console.error('Error fetching menu items:', error)
      toast.error('Failed to load menu items')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const response = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file)
      const url = storage.getFilePreview(STORAGE_BUCKET_ID, response.$id, 400, 400)
      setForm((prev) => ({ ...prev, image_url: url.href }))
      toast.success('Image uploaded')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.restaurant_id) return

    setSaving(true)
    try {
      const data = {
        restaurant_id: profile.restaurant_id,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        image_url: form.image_url,
        is_available: form.is_available,
        prep_time_minutes: parseInt(form.prep_time_minutes),
      }

      if (editingItem) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.MENU_ITEMS,
          editingItem.$id,
          data
        )
        setMenuItems((prev) =>
          prev.map((item) =>
            item.$id === editingItem.$id ? { ...item, ...data } : item
          )
        )
        toast.success('Menu item updated')
      } else {
        const newItem = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.MENU_ITEMS,
          ID.unique(),
          data
        )
        setMenuItems((prev) => [...prev, newItem as MenuItem])
        toast.success('Menu item added')
      }

      setDialogOpen(false)
      setForm(initialForm)
      setEditingItem(null)
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast.error('Failed to save menu item')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      image_url: item.image_url || '',
      is_available: item.is_available,
      prep_time_minutes: item.prep_time_minutes?.toString() || '15',
    })
    setDialogOpen(true)
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.MENU_ITEMS, itemId)
      setMenuItems((prev) => prev.filter((item) => item.$id !== itemId))
      toast.success('Menu item deleted')
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('Failed to delete menu item')
    }
  }

  const toggleAvailability = async (item: MenuItem) => {
    try {
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.MENU_ITEMS, item.$id, {
        is_available: !item.is_available,
      })
      setMenuItems((prev) =>
        prev.map((i) =>
          i.$id === item.$id ? { ...i, is_available: !i.is_available } : i
        )
      )
    } catch (error) {
      console.error('Error toggling availability:', error)
      toast.error('Failed to update availability')
    }
  }

  const groupedItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Menu</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Menu</h1>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setForm(initialForm)
            setEditingItem(null)
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prep_time">Prep Time (min)</Label>
                  <Input
                    id="prep_time"
                    type="number"
                    min="1"
                    value={form.prep_time_minutes}
                    onChange={(e) => setForm((prev) => ({ ...prev, prep_time_minutes: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex items-center gap-4">
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="max-w-[200px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="available"
                  checked={form.is_available}
                  onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_available: checked }))}
                />
                <Label htmlFor="available">Available for ordering</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {menuItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Plus className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No menu items yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first menu item to get started
            </p>
            <Button className="mt-4" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h2 className="mb-4 text-lg font-medium text-foreground">{category}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card key={item.$id} className={!item.is_available ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                            <ImagePlus className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium">{item.name}</h3>
                            <span className="font-semibold text-primary">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            {!item.is_available && (
                              <Badge variant="secondary">Unavailable</Badge>
                            )}
                            {item.prep_time_minutes && (
                              <span className="text-xs text-muted-foreground">
                                {item.prep_time_minutes} min
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.is_available}
                            onCheckedChange={() => toggleAvailability(item)}
                          />
                          <span className="text-sm text-muted-foreground">
                            {item.is_available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(item.$id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
