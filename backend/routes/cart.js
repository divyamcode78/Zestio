const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [cartItems] = await pool.query(
      `SELECT ci.*, mi.name as item_name, mi.image_url, mi.is_available,
              r.name as restaurant_name, r.is_open
       FROM cart_items ci
       JOIN menu_items mi ON ci.menu_item_id = mi.id
       JOIN restaurants r ON ci.restaurant_id = r.id
       WHERE ci.user_id = ?
       ORDER BY ci.created_at`,
      [req.user.id]
    );

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      cartItems,
      summary: {
        subtotal,
        itemCount,
        itemCount: cartItems.length
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { menu_item_id, quantity = 1 } = req.body;

    // Get menu item details
    const [menuItems] = await pool.query(
      `SELECT mi.*, r.id as restaurant_id, r.is_open, r.is_active
       FROM menu_items mi
       JOIN restaurants r ON mi.restaurant_id = r.id
       WHERE mi.id = ? AND mi.is_available = true AND r.is_active = true`,
      [menu_item_id]
    );

    if (menuItems.length === 0) {
      return res.status(404).json({ error: 'Menu item not found or unavailable' });
    }

    const menuItem = menuItems[0];

    if (!menuItem.is_open) {
      return res.status(400).json({ error: 'Restaurant is currently closed' });
    }

    // Check if item already in cart
    const [existingItems] = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND menu_item_id = ?',
      [req.user.id, menu_item_id]
    );

    let cartItem;
    if (existingItems.length > 0) {
      // Update existing item
      const newQuantity = existingItems[0].quantity + quantity;
      const newTotalPrice = menuItem.price * newQuantity;

      await pool.query(
        'UPDATE cart_items SET quantity = ?, total_price = ? WHERE id = ?',
        [newQuantity, newTotalPrice, existingItems[0].id]
      );

      cartItem = { ...existingItems[0], quantity: newQuantity, total_price: newTotalPrice };
    } else {
      // Add new item
      const totalPrice = menuItem.price * quantity;

      const [result] = await pool.query(
        `INSERT INTO cart_items 
         (user_id, restaurant_id, menu_item_id, quantity, unit_price, total_price, item_name) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, menuItem.restaurant_id, menu_item_id, quantity, menuItem.price, totalPrice, menuItem.name]
      );

      cartItem = {
        id: result.insertId,
        quantity,
        total_price: totalPrice
      };
    }

    res.status(201).json({
      message: 'Item added to cart successfully',
      cartItem
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    // Get cart item with menu item
    const [cartItems] = await pool.query(
      `SELECT ci.*, mi.price as current_price
       FROM cart_items ci
       JOIN menu_items mi ON ci.menu_item_id = mi.id
       WHERE ci.id = ? AND ci.user_id = ?`,
      [id, req.user.id]
    );

    if (cartItems.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const cartItem = cartItems[0];
    const newTotalPrice = cartItem.current_price * quantity;

    await pool.query(
      'UPDATE cart_items SET quantity = ?, total_price = ? WHERE id = ?',
      [quantity, newTotalPrice, id]
    );

    res.json({
      message: 'Cart item updated successfully',
      cartItem: {
        ...cartItem,
        quantity,
        total_price: newTotalPrice
      }
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart successfully' });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear cart
router.delete('/clear/all', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE user_id = ?',
      [req.user.id]
    );

    res.json({ 
      message: 'Cart cleared successfully',
      deletedItems: result.affectedRows
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Get cart summary for checkout
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const [cartItems] = await pool.query(
      `SELECT ci.*, mi.price as current_price, mi.is_available,
              r.name as restaurant_name, r.delivery_fee, r.min_order, r.is_open
       FROM cart_items ci
       JOIN menu_items mi ON ci.menu_item_id = mi.id
       JOIN restaurants r ON ci.restaurant_id = r.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      return res.json({ 
        cartItems: [],
        summary: { subtotal: 0, deliveryFee: 0, total: 0, itemCount: 0 }
      });
    }

    // Check if all items are available and restaurant is open
    const unavailableItems = cartItems.filter(item => !item.is_available);
    if (unavailableItems.length > 0) {
      return res.status(400).json({
        error: 'Some items in your cart are no longer available',
        unavailableItems: unavailableItems.map(item => item.id)
      });
    }

    if (!cartItems[0].is_open) {
      return res.status(400).json({ error: 'Restaurant is currently closed' });
    }

    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
    const deliveryFee = parseFloat(cartItems[0].delivery_fee);
    const minOrder = parseFloat(cartItems[0].min_order);
    const total = subtotal + deliveryFee;

    if (subtotal < minOrder) {
      return res.status(400).json({
        error: `Minimum order amount is $${minOrder}`,
        minOrder,
        currentSubtotal: subtotal
      });
    }

    res.json({
      cartItems,
      summary: {
        subtotal,
        deliveryFee,
        total,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        restaurant: {
          name: cartItems[0].restaurant_name,
          deliveryFee,
          minOrder
        }
      }
    });

  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({ error: 'Failed to get cart summary' });
  }
});

module.exports = router;
