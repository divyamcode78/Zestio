const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, name, email, role, phone, address, avatar_url, is_active, created_at FROM users WHERE 1=1';
    const queryParams = [];

    if (role) {
      query += ' AND role = ?';
      queryParams.push(role);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [users] = await pool.query(query, queryParams);

    // Get count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];

    if (role) {
      countQuery += ' AND role = ?';
      countParams.push(role);
    }

    if (search) {
      countQuery += ' AND (name LIKE ? OR email LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only see their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [users] = await pool.query(
      'SELECT id, name, email, role, phone, address, avatar_url, is_active, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user (admin or self)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone, address, avatar_url, is_active } = req.body;

    // Check permissions
    if (req.user.role !== 'admin') {
      // Non-admin users can only update their own profile and limited fields
      if (req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      // Non-admin users cannot change role or is_active status
      if (role !== undefined || is_active !== undefined) {
        return res.status(403).json({ error: 'Cannot modify role or active status' });
      }
    }

    // Check if user exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check email uniqueness if email is being changed
    if (email) {
      const [emailCheck] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, id]
      );

      if (emailCheck.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (role !== undefined && req.user.role === 'admin') {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (address !== undefined) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }
    if (avatar_url !== undefined) {
      updateFields.push('avatar_url = ?');
      updateValues.push(avatar_url);
    }
    if (is_active !== undefined && req.user.role === 'admin') {
      updateFields.push('is_active = ?');
      updateValues.push(is_active);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateValues.push(id);

    await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated user
    const [updatedUser] = await pool.query(
      'SELECT id, name, email, role, phone, address, avatar_url, is_active, created_at FROM users WHERE id = ?',
      [id]
    );

    res.json({
      message: 'User updated successfully',
      user: updatedUser[0]
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check if user has active orders
    const [activeOrders] = await pool.query(
      'SELECT id FROM orders WHERE customer_id = ? AND status NOT IN ("delivered", "cancelled")',
      [id]
    );

    if (activeOrders.length > 0) {
      return res.status(400).json({ error: 'Cannot delete user with active orders' });
    }

    // Check if user owns a restaurant
    const [restaurants] = await pool.query(
      'SELECT id FROM restaurants WHERE owner_id = ?',
      [id]
    );

    if (restaurants.length > 0) {
      return res.status(400).json({ error: 'Cannot delete user who owns a restaurant' });
    }

    const [result] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Toggle user active status (admin only)
router.patch('/:id/toggle-active', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deactivation
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }

    const [result] = await pool.query(
      'UPDATE users SET is_active = NOT is_active WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get updated user
    const [updatedUser] = await pool.query(
      'SELECT id, name, email, role, is_active FROM users WHERE id = ?',
      [id]
    );

    res.json({
      message: `User ${updatedUser[0].is_active ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser[0]
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
});

// Get user statistics (admin only)
router.get('/stats/overview', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    // Get user counts by role
    const [roleStats] = await pool.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);

    // Get active vs inactive users
    const [activeStats] = await pool.query(`
      SELECT 
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_users
      FROM users
    `);

    // Get recent registrations
    const [recentUsers] = await pool.query(`
      SELECT id, name, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    res.json({
      roleStats,
      activeStats: activeStats[0],
      recentUsers
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

module.exports = router;
