const request = require('supertest');
const express = require('express');

// Mock the order routes for testing
const app = express();
app.use(express.json());

// Sample order data
let mockOrders = [
  { id: 1, userId: 1, items: [{ menuId: 1, quantity: 2, price: 12.99 }], total: 25.98, status: 'pending', createdAt: '2024-01-15' },
  { id: 2, userId: 1, items: [{ menuId: 3, quantity: 1, price: 8.99 }], total: 8.99, status: 'delivered', createdAt: '2024-01-14' }
];

// GET /api/orders - Fetch user orders
app.get('/api/orders', (req, res) => {
  const { userId, status } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  let filteredOrders = mockOrders.filter(order => order.userId === parseInt(userId));
  
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }
  
  return res.status(200).json({
    success: true,
    count: filteredOrders.length,
    data: filteredOrders
  });
});

// GET /api/orders/:id - Fetch single order
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const order = mockOrders.find(order => order.id === parseInt(id));
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  return res.status(200).json({
    success: true,
    data: order
  });
});

// POST /api/orders - Create new order
app.post('/api/orders', (req, res) => {
  const { userId, items, total, address, paymentMethod } = req.body;
  
  if (!userId || !items || !total || !address || !paymentMethod) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }
  
  if (total <= 0) {
    return res.status(400).json({ error: 'Total must be greater than 0' });
  }
  
  const newOrder = {
    id: mockOrders.length + 1,
    userId,
    items,
    total,
    status: 'pending',
    address,
    paymentMethod,
    createdAt: new Date().toISOString()
  };
  
  mockOrders.push(newOrder);
  
  return res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: newOrder
  });
});

// PUT /api/orders/:id/status - Update order status
app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  const orderIndex = mockOrders.findIndex(order => order.id === parseInt(id));
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  mockOrders[orderIndex].status = status;
  
  return res.status(200).json({
    success: true,
    message: 'Order status updated',
    data: mockOrders[orderIndex]
  });
});

// DELETE /api/orders/:id - Cancel order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const orderIndex = mockOrders.findIndex(order => order.id === parseInt(id));
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  const order = mockOrders[orderIndex];
  
  if (order.status !== 'pending') {
    return res.status(400).json({ error: 'Can only cancel pending orders' });
  }
  
  mockOrders[orderIndex].status = 'cancelled';
  
  return res.status(200).json({
    success: true,
    message: 'Order cancelled successfully'
  });
});

describe('Orders API', () => {
  describe('GET /api/orders', () => {
    it('should fetch user orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .query({ userId: 1 });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter orders by status', async () => {
      const response = await request(app)
        .get('/api/orders')
        .query({ userId: 1, status: 'pending' });
      
      expect(response.status).toBe(200);
      expect(response.body.data.every(order => order.status === 'pending')).toBe(true);
    });

    it('should reject request without user ID', async () => {
      const response = await request(app).get('/api/orders');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('User ID is required');
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should fetch single order by ID', async () => {
      const response = await request(app).get('/api/orders/1');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app).get('/api/orders/999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Order not found');
    });
  });

  describe('POST /api/orders', () => {
    it('should create new order with valid data', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          userId: 1,
          items: [{ menuId: 1, quantity: 2, price: 12.99 }],
          total: 25.98,
          address: '123 Main St',
          paymentMethod: 'card'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('pending');
    });

    it('should reject order with missing fields', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          userId: 1,
          items: [{ menuId: 1, quantity: 2, price: 12.99 }]
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('All fields are required');
    });

    it('should reject order with empty items', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          userId: 1,
          items: [],
          total: 0,
          address: '123 Main St',
          paymentMethod: 'card'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Order must contain at least one item');
    });

    it('should reject order with invalid total', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          userId: 1,
          items: [{ menuId: 1, quantity: 2, price: 12.99 }],
          total: -10,
          address: '123 Main St',
          paymentMethod: 'card'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Total must be greater than 0');
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    it('should update order status', async () => {
      const response = await request(app)
        .put('/api/orders/1/status')
        .send({ status: 'confirmed' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('confirmed');
    });

    it('should reject invalid status', async () => {
      const response = await request(app)
        .put('/api/orders/1/status')
        .send({ status: 'invalid_status' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid status');
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .put('/api/orders/999/status')
        .send({ status: 'confirmed' });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Order not found');
    });
  });

  describe('DELETE /api/orders/:id', () => {
    it('should cancel pending order', async () => {
      const response = await request(app).delete('/api/orders/1');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Order cancelled successfully');
    });

    it('should reject cancellation of non-pending order', async () => {
      const response = await request(app).delete('/api/orders/2');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Can only cancel pending orders');
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app).delete('/api/orders/999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Order not found');
    });
  });
});
