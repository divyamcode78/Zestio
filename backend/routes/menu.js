const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get menu items for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { category, available_only = true } = req.query;

    let query = `
      SELECT mi.* 
      FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      WHERE mi.restaurant_id = ? AND r.is_active = true
    `;
    const queryParams = [restaurantId];

    if (available_only === 'true') {
      query += ' AND mi.is_available = true';
    }

    if (category) {
      query += ' AND mi.category = ?';
      queryParams.push(category);
    }

    query += ' ORDER BY mi.category, mi.name';

    const [menuItems] = await pool.query(query, queryParams);

    // Group by category
    const groupedItems = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    res.json({
      menuItems: groupedItems,
      allItems: menuItems
    });

  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [menuItems] = await pool.query(
      `SELECT mi.*, r.name as restaurant_name, r.is_active as restaurant_active
       FROM menu_items mi
       JOIN restaurants r ON mi.restaurant_id = r.id
       WHERE mi.id = ? AND r.is_active = true`,
      [id]
    );

    if (menuItems.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ menuItem: menuItems[0] });

  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// Create menu item (restaurant owners only)
router.post('/', authenticateToken, authorizeRoles('restaurant', 'admin'), async (req, res) => {
  try {
    const {
      restaurant_id, name, description, price, category,
      image_url, is_available = true, is_featured = false, prep_time_minutes
    } = req.body;

    // Verify restaurant ownership
    if (req.user.role === 'restaurant') {
      const [restaurants] = await pool.query(
        'SELECT owner_id FROM restaurants WHERE id = ? AND owner_id = ?',
        [restaurant_id, req.user.id]
      );

      if (restaurants.length === 0) {
        return res.status(403).json({ error: 'Access denied or restaurant not found' });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO menu_items 
       (restaurant_id, name, description, price, category, image_url, 
        is_available, is_featured, prep_time_minutes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        restaurant_id, name, description, price, category, image_url,
        is_available, is_featured, prep_time_minutes
      ]
    );

    // Get created menu item
    const [newMenuItem] = await pool.query(
      'SELECT * FROM menu_items WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem: newMenuItem[0]
    });

  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// Update menu item (restaurant owners only)
router.put('/:id', authenticateToken, authorizeRoles('restaurant', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, description, price, category, image_url,
      is_available, is_featured, prep_time_minutes
    } = req.body;

    // Get menu item with restaurant info
    const [menuItems] = await pool.query(
      `SELECT mi.*, r.owner_id 
       FROM menu_items mi
       JOIN restaurants r ON mi.restaurant_id = r.id
       WHERE mi.id = ?`,
      [id]
    );

    if (menuItems.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const menuItem = menuItems[0];

    // Check ownership
    if (req.user.role === 'restaurant' && menuItem.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [result] = await pool.query(
      `UPDATE menu_items 
       SET name = ?, description = ?, price = ?, category = ?, image_url = ?,
           is_available = ?, is_featured = ?, prep_time_minutes = ?
       WHERE id = ?`,
      [
        name, description, price, category, image_url,
        is_available, is_featured, prep_time_minutes, id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Get updated menu item
    const [updatedMenuItem] = await pool.query(
      'SELECT * FROM menu_items WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Menu item updated successfully',
      menuItem: updatedMenuItem[0]
    });

  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// Delete menu item (restaurant owners only)
router.delete('/:id', authenticateToken, authorizeRoles('restaurant', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Get menu item with restaurant info
    const [menuItems] = await pool.query(
      `SELECT mi.*, r.owner_id 
       FROM menu_items mi
       JOIN restaurants r ON mi.restaurant_id = r.id
       WHERE mi.id = ?`,
      [id]
    );

    if (menuItems.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const menuItem = menuItems[0];

    // Check ownership
    if (req.user.role === 'restaurant' && menuItem.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if item is in any active orders
    const [orderItems] = await pool.query(
      `SELECT oi.id 
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE oi.menu_item_id = ? AND o.status NOT IN ('delivered', 'cancelled')`,
      [id]
    );

    if (orderItems.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete menu item that is in active orders' 
      });
    }

    const [result] = await pool.query(
      'DELETE FROM menu_items WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });

  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// Toggle menu item availability (restaurant owners only)
router.patch('/:id/toggle-availability', authenticateToken, authorizeRoles('restaurant', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Get menu item with restaurant info
    const [menuItems] = await pool.query(
      `SELECT mi.*, r.owner_id 
       FROM menu_items mi
       JOIN restaurants r ON mi.restaurant_id = r.id
       WHERE mi.id = ?`,
      [id]
    );

    if (menuItems.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const menuItem = menuItems[0];

    // Check ownership
    if (req.user.role === 'restaurant' && menuItem.owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [result] = await pool.query(
      'UPDATE menu_items SET is_available = NOT is_available WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Get updated menu item
    const [updatedMenuItem] = await pool.query(
      'SELECT * FROM menu_items WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Menu item availability updated successfully',
      menuItem: updatedMenuItem[0]
    });

  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({ error: 'Failed to update menu item availability' });
  }
});

module.exports = router;
