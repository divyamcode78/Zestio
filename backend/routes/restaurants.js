const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all restaurants (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, cuisine_type, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT r.*, u.name as owner_name 
      FROM restaurants r 
      LEFT JOIN users u ON r.owner_id = u.id 
      WHERE r.is_active = true AND r.is_approved = true
    `;
    const queryParams = [];

    if (cuisine_type) {
      query += ' AND r.cuisine_type = ?';
      queryParams.push(cuisine_type);
    }

    if (search) {
      query += ' AND (r.name LIKE ? OR r.description LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY r.rating DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [restaurants] = await pool.query(query, queryParams);

    // Get count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM restaurants WHERE is_active = true AND is_approved = true';
    const countParams = [];

    if (cuisine_type) {
      countQuery += ' AND cuisine_type = ?';
      countParams.push(cuisine_type);
    }

    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      restaurants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// Get restaurant by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [restaurants] = await pool.query(
      `SELECT r.*, u.name as owner_name 
       FROM restaurants r 
       LEFT JOIN users u ON r.owner_id = u.id 
       WHERE r.id = ? AND r.is_active = true`,
      [id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ restaurant: restaurants[0] });

  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});

// Create restaurant (restaurant owners only)
router.post('/', authenticateToken, authorizeRoles('restaurant', 'admin'), [
  // Add validation middleware here if needed
], async (req, res) => {
  try {
    const {
      name, description, cuisine_type, address, phone, email,
      delivery_fee, min_order, estimated_delivery_time, opening_hours
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO restaurants 
       (owner_id, name, description, cuisine_type, address, phone, email, 
        delivery_fee, min_order, estimated_delivery_time, opening_hours, is_approved) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, name, description, cuisine_type, address, phone, email,
        delivery_fee || 0, min_order || 0, estimated_delivery_time, opening_hours,
        req.user.role === 'admin' // Auto-approve if admin creates
      ]
    );

    // Get created restaurant
    const [newRestaurant] = await pool.query(
      'SELECT * FROM restaurants WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant: newRestaurant[0]
    });

  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
});

// Update restaurant (owner or admin)
router.put('/:id', authenticateToken, authorizeRoles('restaurant', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user owns the restaurant or is admin
    const [restaurants] = await pool.query(
      'SELECT owner_id FROM restaurants WHERE id = ?',
      [id]
    );

    if (restaurants.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const restaurant = restaurants[0];

    if (req.user.role !== 'admin' && restaurant.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const {
      name, description, cuisine_type, address, phone, email,
      delivery_fee, min_order, estimated_delivery_time, opening_hours, is_open
    } = req.body;

    const [result] = await pool.query(
      `UPDATE restaurants 
       SET name = ?, description = ?, cuisine_type = ?, address = ?, phone = ?, email = ?,
           delivery_fee = ?, min_order = ?, estimated_delivery_time = ?, opening_hours = ?, is_open = ?
       WHERE id = ?`,
      [
        name, description, cuisine_type, address, phone, email,
        delivery_fee, min_order, estimated_delivery_time, opening_hours, is_open, id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Get updated restaurant
    const [updatedRestaurant] = await pool.query(
      'SELECT * FROM restaurants WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Restaurant updated successfully',
      restaurant: updatedRestaurant[0]
    });

  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
});

// Get restaurant's menu items
router.get('/:id/menu', async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query;

    let query = `
      SELECT * FROM menu_items 
      WHERE restaurant_id = ? AND is_available = true
    `;
    const queryParams = [id];

    if (category) {
      query += ' AND category = ?';
      queryParams.push(category);
    }

    query += ' ORDER BY category, name';

    const [menuItems] = await pool.query(query, queryParams);

    res.json({ menuItems });

  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

module.exports = router;
