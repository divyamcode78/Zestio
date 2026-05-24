const request = require('supertest');
const express = require('express');

// Mock the auth routes for testing
const app = express();
app.use(express.json());

// Sample auth endpoint (replace with actual import when testing real routes)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  if (email === 'test@example.com' && password === 'password123') {
    return res.status(200).json({ 
      success: true, 
      token: 'mock-jwt-token',
      user: { id: 1, email, role: 'customer' }
    });
  }
  
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name, phone, role } = req.body;
  
  if (!email || !password || !name || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  // Simulate user already exists
  if (email === 'existing@example.com') {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  return res.status(201).json({ 
    success: true, 
    message: 'User registered successfully',
    user: { id: 2, email, name, phone, role: role || 'customer' }
  });
});

describe('Auth API', () => {
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email and password are required');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should reject missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email and password are required');
    });

    it('should reject missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email and password are required');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'John Doe',
          phone: '1234567890',
          role: 'customer'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user.email).toBe('newuser@example.com');
      expect(response.body.user.name).toBe('John Doe');
    });

    it('should reject registration with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('All fields are required');
    });

    it('should reject registration with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalidemail',
          password: 'password123',
          name: 'John Doe',
          phone: '1234567890'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid email format');
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: '123',
          name: 'John Doe',
          phone: '1234567890'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Password must be at least 6 characters');
    });

    it('should reject registration for existing user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password123',
          name: 'John Doe',
          phone: '1234567890'
        });
      
      expect(response.status).toBe(409);
      expect(response.body.error).toBe('User already exists');
    });

    it('should set default role to customer if not provided', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser2@example.com',
          password: 'password123',
          name: 'Jane Doe',
          phone: '0987654321'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.user.role).toBe('customer');
    });
  });
});
