const request = require('supertest');
const express = require('express');

// Mock the cart routes for testing
const app = express();
app.use(express.json());

// Sample cart data
let mockCart = {
  userId: 1,
  items: [
    { id: 1, menuId: 1, name: 'Margherita Pizza', price: 12.99, quantity: 2 },
    { id: 2, menuId: 3, name: 'Caesar Salad', price: 8.99, quantity: 1 }
  ]
};

// GET /api/cart - Fetch user's cart
app.get('/api/cart', (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  return res.status(200).json({
    success: true,
    data: mockCart
  });
});

// POST /api/cart/add - Add item to cart
app.post('/api/cart/add', (req, res) => {
  const { userId, menuId, name, price, quantity } = req.body;
  
  if (!userId || !menuId || !name || !price || !quantity) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (quantity <= 0) {
    return res.status(400).json({ error: 'Quantity must be greater than 0' });
  }
  
  // Check if item already exists in cart
  const existingItem = mockCart.items.find(item => item.menuId === menuId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    mockCart.items.push({
      id: mockCart.items.length + 1,
      menuId,
      name,
      price,
      quantity
    });
  }
  
  return res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: mockCart
  });
});

// PUT /api/cart/update - Update item quantity
app.put('/api/cart/update', (req, res) => {
  const { userId, itemId, quantity } = req.body;
  
  if (!userId || !itemId || !quantity) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (quantity <= 0) {
    return res.status(400).json({ error: 'Quantity must be greater than 0' });
  }
  
  const item = mockCart.items.find(item => item.id === itemId);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }
  
  item.quantity = quantity;
  
  return res.status(200).json({
    success: true,
    message: 'Cart updated',
    data: mockCart
  });
});

// DELETE /api/cart/remove - Remove item from cart
app.delete('/api/cart/remove', (req, res) => {
  const { userId, itemId } = req.body;
  
  if (!userId || !itemId) {
    return res.status(400).json({ error: 'User ID and Item ID are required' });
  }
  
  const itemIndex = mockCart.items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }
  
  mockCart.items.splice(itemIndex, 1);
  
  return res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: mockCart
  });
});

// DELETE /api/cart/clear - Clear entire cart
app.delete('/api/cart/clear', (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  mockCart.items = [];
  
  return res.status(200).json({
    success: true,
    message: 'Cart cleared',
    data: mockCart
  });
});

describe('Cart API', () => {
  describe('GET /api/cart', () => {
    it('should fetch user cart', async () => {
      const response = await request(app)
        .get('/api/cart')
        .query({ userId: 1 });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.items)).toBe(true);
    });

    it('should reject request without user ID', async () => {
      const response = await request(app).get('/api/cart');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('User ID is required');
    });
  });

  describe('POST /api/cart/add', () => {
    it('should add new item to cart', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .send({
          userId: 1,
          menuId: 5,
          name: 'Garlic Bread',
          price: 4.99,
          quantity: 2
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.items.length).toBeGreaterThan(0);
    });

    it('should update quantity if item already exists', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .send({
          userId: 1,
          menuId: 1,
          name: 'Margherita Pizza',
          price: 12.99,
          quantity: 1
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject item with missing fields', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .send({
          userId: 1,
          menuId: 5,
          name: 'Incomplete Item'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('All fields are required');
    });

    it('should reject item with invalid quantity', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .send({
          userId: 1,
          menuId: 5,
          name: 'Invalid Item',
          price: 10,
          quantity: 0
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Quantity must be greater than 0');
    });
  });

  describe('PUT /api/cart/update', () => {
    it('should update item quantity', async () => {
      const response = await request(app)
        .put('/api/cart/update')
        .send({
          userId: 1,
          itemId: 1,
          quantity: 5
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject update for non-existent item', async () => {
      const response = await request(app)
        .put('/api/cart/update')
        .send({
          userId: 1,
          itemId: 999,
          quantity: 2
        });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found in cart');
    });

    it('should reject invalid quantity', async () => {
      const response = await request(app)
        .put('/api/cart/update')
        .send({
          userId: 1,
          itemId: 1,
          quantity: -1
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Quantity must be greater than 0');
    });
  });

  describe('DELETE /api/cart/remove', () => {
    it('should remove item from cart', async () => {
      const response = await request(app)
        .delete('/api/cart/remove')
        .send({
          userId: 1,
          itemId: 1
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Item removed from cart');
    });

    it('should reject removal without item ID', async () => {
      const response = await request(app)
        .delete('/api/cart/remove')
        .send({ userId: 1 });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('User ID and Item ID are required');
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .delete('/api/cart/remove')
        .send({
          userId: 1,
          itemId: 999
        });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found in cart');
    });
  });

  describe('DELETE /api/cart/clear', () => {
    it('should clear entire cart', async () => {
      const response = await request(app)
        .delete('/api/cart/clear')
        .send({ userId: 1 });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toEqual([]);
    });

    it('should reject clear without user ID', async () => {
      const response = await request(app)
        .delete('/api/cart/clear')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('User ID is required');
    });
  });
});
