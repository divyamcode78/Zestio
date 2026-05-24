const request = require('supertest');
const express = require('express');

// Mock the menu routes for testing
const app = express();
app.use(express.json());

// Sample menu data
const mockMenuItems = [
  { id: 1, name: 'Margherita Pizza', price: 12.99, category: 'pizza', available: true, description: 'Classic tomato and cheese' },
  { id: 2, name: 'Pepperoni Pizza', price: 14.99, category: 'pizza', available: true, description: 'Spicy pepperoni with cheese' },
  { id: 3, name: 'Caesar Salad', price: 8.99, category: 'salad', available: true, description: 'Fresh romaine with caesar dressing' },
  { id: 4, name: 'Garlic Bread', price: 4.99, category: 'sides', available: false, description: 'Crispy garlic bread' }
];

// GET /api/menu - Fetch all menu items
app.get('/api/menu', (req, res) => {
  const { category, available } = req.query;
  
  let filteredItems = [...mockMenuItems];
  
  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }
  
  if (available === 'true') {
    filteredItems = filteredItems.filter(item => item.available === true);
  }
  
  return res.status(200).json({
    success: true,
    count: filteredItems.length,
    data: filteredItems
  });
});

// GET /api/menu/:id - Fetch single menu item
app.get('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const item = mockMenuItems.find(item => item.id === parseInt(id));
  
  if (!item) {
    return res.status(404).json({ error: 'Menu item not found' });
  }
  
  return res.status(200).json({
    success: true,
    data: item
  });
});

// POST /api/menu - Add new menu item (admin only)
app.post('/api/menu', (req, res) => {
  const { name, price, category, description } = req.body;
  
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }
  
  if (price <= 0) {
    return res.status(400).json({ error: 'Price must be greater than 0' });
  }
  
  const newItem = {
    id: mockMenuItems.length + 1,
    name,
    price,
    category,
    description: description || '',
    available: true
  };
  
  mockMenuItems.push(newItem);
  
  return res.status(201).json({
    success: true,
    message: 'Menu item added successfully',
    data: newItem
  });
});

// PUT /api/menu/:id - Update menu item (admin only)
app.put('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, category, available, description } = req.body;
  
  const itemIndex = mockMenuItems.findIndex(item => item.id === parseInt(id));
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Menu item not found' });
  }
  
  if (price !== undefined && price <= 0) {
    return res.status(400).json({ error: 'Price must be greater than 0' });
  }
  
  mockMenuItems[itemIndex] = {
    ...mockMenuItems[itemIndex],
    name: name || mockMenuItems[itemIndex].name,
    price: price || mockMenuItems[itemIndex].price,
    category: category || mockMenuItems[itemIndex].category,
    description: description || mockMenuItems[itemIndex].description,
    available: available !== undefined ? available : mockMenuItems[itemIndex].available
  };
  
  return res.status(200).json({
    success: true,
    message: 'Menu item updated successfully',
    data: mockMenuItems[itemIndex]
  });
});

// DELETE /api/menu/:id - Delete menu item (admin only)
app.delete('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const itemIndex = mockMenuItems.findIndex(item => item.id === parseInt(id));
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Menu item not found' });
  }
  
  mockMenuItems.splice(itemIndex, 1);
  
  return res.status(200).json({
    success: true,
    message: 'Menu item deleted successfully'
  });
});

describe('Menu API', () => {
  describe('GET /api/menu', () => {
    it('should fetch all menu items', async () => {
      const response = await request(app).get('/api/menu');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter menu items by category', async () => {
      const response = await request(app).get('/api/menu?category=pizza');
      
      expect(response.status).toBe(200);
      expect(response.body.data.every(item => item.category === 'pizza')).toBe(true);
    });

    it('should filter only available items', async () => {
      const response = await request(app).get('/api/menu?available=true');
      
      expect(response.status).toBe(200);
      expect(response.body.data.every(item => item.available === true)).toBe(true);
    });

    it('should handle empty results gracefully', async () => {
      const response = await request(app).get('/api/menu?category=nonexistent');
      
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/menu/:id', () => {
    it('should fetch a single menu item by ID', async () => {
      const response = await request(app).get('/api/menu/1');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
      expect(response.body.data.name).toBeDefined();
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app).get('/api/menu/999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Menu item not found');
    });

    it('should handle invalid ID format', async () => {
      const response = await request(app).get('/api/menu/invalid');
      
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/menu', () => {
    it('should add a new menu item with valid data', async () => {
      const response = await request(app)
        .post('/api/menu')
        .send({
          name: 'Veggie Burger',
          price: 11.99,
          category: 'burger',
          description: 'Fresh vegetable patty'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Veggie Burger');
      expect(response.body.data.price).toBe(11.99);
    });

    it('should reject item without required fields', async () => {
      const response = await request(app)
        .post('/api/menu')
        .send({
          name: 'Incomplete Item'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name, price, and category are required');
    });

    it('should reject item with invalid price', async () => {
      const response = await request(app)
        .post('/api/menu')
        .send({
          name: 'Free Item',
          price: 0,
          category: 'sides'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Price must be greater than 0');
    });

    it('should set default availability to true', async () => {
      const response = await request(app)
        .post('/api/menu')
        .send({
          name: 'New Item',
          price: 9.99,
          category: 'drinks'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.data.available).toBe(true);
    });
  });

  describe('PUT /api/menu/:id', () => {
    it('should update an existing menu item', async () => {
      const response = await request(app)
        .put('/api/menu/1')
        .send({
          name: 'Updated Margherita Pizza',
          price: 13.99
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Margherita Pizza');
      expect(response.body.data.price).toBe(13.99);
    });

    it('should toggle item availability', async () => {
      const response = await request(app)
        .put('/api/menu/4')
        .send({ available: true });
      
      expect(response.status).toBe(200);
      expect(response.body.data.available).toBe(true);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .put('/api/menu/999')
        .send({ name: 'Updated Name' });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Menu item not found');
    });

    it('should reject invalid price update', async () => {
      const response = await request(app)
        .put('/api/menu/1')
        .send({ price: -5 });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Price must be greater than 0');
    });
  });

  describe('DELETE /api/menu/:id', () => {
    it('should delete an existing menu item', async () => {
      const response = await request(app).delete('/api/menu/2');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Menu item deleted successfully');
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app).delete('/api/menu/999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Menu item not found');
    });
  });
});
