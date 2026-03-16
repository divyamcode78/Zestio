const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get orders for current user
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT o.*, 
             r.name as restaurant_name, r.image_url as restaurant_image,
             d.name as driver_name, d.phone as driver_phone
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      LEFT JOIN users d ON o.driver_id = d.id
      WHERE o.customer_id = ?
    `;
    const queryParams = [req.user.id];

    if (status) {
      query += ' AND o.status = ?';
      queryParams.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [orders] = await pool.query(query, queryParams);

    // Get order items for each order
    for (const order of orders) {
      const [orderItems] = await pool.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = orderItems;
    }

    res.json({ orders });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await pool.query(
      `SELECT o.*, 
              r.name as restaurant_name, r.phone as restaurant_phone, r.address as restaurant_address,
              d.name as driver_name, d.phone as driver_phone
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       LEFT JOIN users d ON o.driver_id = d.id
       WHERE o.id = ? AND (o.customer_id = ? OR o.restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = ?) OR o.driver_id = ? OR ? = 'admin')`,
      [id, req.user.id, req.user.id, req.user.id, req.user.role]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    // Get order items
    const [orderItems] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );

    order.items = orderItems;

    res.json({ order });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      restaurant_id,
      delivery_address,
      customer_name,
      customer_phone,
      special_instructions,
      payment_method = 'cod'
    } = req.body;

    // Get cart items
    const [cartItems] = await pool.query(
      `SELECT ci.*, mi.price as current_price, mi.is_available
       FROM cart_items ci
       JOIN menu_items mi ON ci.menu_item_id = mi.id
       WHERE ci.user_id = ? AND ci.restaurant_id = ?`,
      [req.user.id, restaurant_id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Check availability
    const unavailableItems = cartItems.filter(item => !item.is_available);
    if (unavailableItems.length > 0) {
      return res.status(400).json({ error: 'Some items are no longer available' });
    }

    // Get restaurant info
    const [restaurants] = await pool.query(
      'SELECT * FROM restaurants WHERE id = ? AND is_active = true',
      [restaurant_id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const restaurant = restaurants[0];

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
    const deliveryFee = parseFloat(restaurant.delivery_fee);
    const total = subtotal + deliveryFee;

    // Check minimum order
    if (subtotal < parseFloat(restaurant.min_order)) {
      return res.status(400).json({
        error: `Minimum order amount is $${restaurant.min_order}`,
        minOrder: restaurant.min_order
      });
    }

    // Create order
    const [orderResult] = await pool.query(
      `INSERT INTO orders 
       (customer_id, restaurant_id, subtotal, delivery_fee, total_amount, 
        delivery_address, customer_name, customer_phone, special_instructions,
        restaurant_name, estimated_delivery_time, estimated_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, restaurant_id, subtotal, deliveryFee, total,
        delivery_address, customer_name, customer_phone, special_instructions,
        restaurant.name, restaurant.estimated_delivery_time, 30 // Default 30 mins
      ]
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const cartItem of cartItems) {
      await pool.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price, item_name) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, cartItem.menu_item_id, cartItem.quantity, cartItem.unit_price, cartItem.total_price, cartItem.item_name]
      );
    }

    // Clear cart
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    // Get created order with items
    const [newOrder] = await pool.query(
      `SELECT o.*, r.name as restaurant_name
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.id = ?`,
      [orderId]
    );

    const [orderItems] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    newOrder[0].items = orderItems;

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder[0]
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status (restaurant owners, drivers, admin)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get order with permissions
    const [orders] = await pool.query(
      `SELECT o.*, r.owner_id as restaurant_owner_id
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.id = ?`,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    // Check permissions
    let hasPermission = false;
    if (req.user.role === 'admin') {
      hasPermission = true;
    } else if (req.user.role === 'restaurant' && order.restaurant_owner_id === req.user.id) {
      // Restaurant can update to: confirmed, preparing, ready, cancelled
      const allowedStatuses = ['confirmed', 'preparing', 'ready', 'cancelled'];
      hasPermission = allowedStatuses.includes(status);
    } else if (req.user.role === 'driver' && order.driver_id === req.user.id) {
      // Driver can update to: picked_up, delivered
      const allowedStatuses = ['picked_up', 'delivered'];
      hasPermission = allowedStatuses.includes(status);
    }

    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions to update this order' });
    }

    // Update order
    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get updated order
    const [updatedOrder] = await pool.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder[0]
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get restaurant orders (restaurant owners)
router.get('/restaurant/my-orders', authenticateToken, authorizeRoles('restaurant', 'admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT o.*, u.name as customer_name, u.phone as customer_phone
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      JOIN users u ON o.customer_id = u.id
      WHERE r.owner_id = ?
    `;
    const queryParams = [req.user.id];

    if (status) {
      query += ' AND o.status = ?';
      queryParams.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [orders] = await pool.query(query, queryParams);

    // Get order items for each order
    for (const order of orders) {
      const [orderItems] = await pool.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = orderItems;
    }

    res.json({ orders });

  } catch (error) {
    console.error('Get restaurant orders error:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant orders' });
  }
});

// Get driver orders (drivers)
router.get('/driver/my-orders', authenticateToken, authorizeRoles('driver', 'admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT o.*, 
             r.name as restaurant_name, r.address as restaurant_address,
             u.name as customer_name, u.phone as customer_phone
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      JOIN users u ON o.customer_id = u.id
      WHERE o.driver_id = ? OR (o.status = 'ready' AND o.driver_id IS NULL)
    `;
    const queryParams = [req.user.id];

    if (status) {
      query += ' AND o.status = ?';
      queryParams.push(status);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [orders] = await pool.query(query, queryParams);

    // Get order items for each order
    for (const order of orders) {
      const [orderItems] = await pool.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );
      order.items = orderItems;
    }

    res.json({ orders });

  } catch (error) {
    console.error('Get driver orders error:', error);
    res.status(500).json({ error: 'Failed to fetch driver orders' });
  }
});

module.exports = router;
