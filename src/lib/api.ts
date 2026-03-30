// API configuration for Express backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  },

  register: async (email, password, name, role) => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
    
    // Store token
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  },

  getCurrentUser: async () => {
    return await apiCall('/auth/me');
  },

  updateProfile: async (profileData) => {
    return await apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  forgotPassword: async (email) => {
    return await apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token, newPassword) => {
    return await apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },
};

// Restaurants API calls
export const restaurantsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/restaurants?${queryString}`);
  },

  getById: async (id) => {
    return await apiCall(`/restaurants/${id}`);
  },

  create: async (restaurantData) => {
    return await apiCall('/restaurants', {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    });
  },

  update: async (id, restaurantData) => {
    return await apiCall(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(restaurantData),
    });
  },

  getMenu: async (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/restaurants/${id}/menu?${queryString}`);
  },
};

// Menu API calls
export const menuAPI = {
  getRestaurantMenu: async (restaurantId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/menu/restaurant/${restaurantId}?${queryString}`);
  },

  getById: async (id) => {
    return await apiCall(`/menu/${id}`);
  },

  create: async (menuItemData) => {
    return await apiCall('/menu', {
      method: 'POST',
      body: JSON.stringify(menuItemData),
    });
  },

  update: async (id, menuItemData) => {
    return await apiCall(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(menuItemData),
    });
  },

  delete: async (id) => {
    return await apiCall(`/menu/${id}`, {
      method: 'DELETE',
    });
  },

  toggleAvailability: async (id) => {
    return await apiCall(`/menu/${id}/toggle-availability`, {
      method: 'PATCH',
    });
  },
};

// Cart API calls
export const cartAPI = {
  get: async () => {
    return await apiCall('/cart');
  },

  add: async (menuItemId, quantity = 1) => {
    return await apiCall('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ menu_item_id: menuItemId, quantity }),
    });
  },

  update: async (id, quantity) => {
    return await apiCall(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  remove: async (id) => {
    return await apiCall(`/cart/${id}`, {
      method: 'DELETE',
    });
  },

  clear: async () => {
    return await apiCall('/cart/clear/all', {
      method: 'DELETE',
    });
  },

  getSummary: async () => {
    return await apiCall('/cart/summary');
  },
};

// Orders API calls
export const ordersAPI = {
  getMyOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/orders/my-orders?${queryString}`);
  },

  getById: async (id) => {
    return await apiCall(`/orders/${id}`);
  },

  create: async (orderData) => {
    return await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  updateStatus: async (id, status) => {
    return await apiCall(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getRestaurantOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/orders/restaurant/my-orders?${queryString}`);
  },

  getDriverOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/orders/driver/my-orders?${queryString}`);
  },
};

// Users API calls (admin)
export const usersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/users?${queryString}`);
  },

  getById: async (id) => {
    return await apiCall(`/users/${id}`);
  },

  update: async (id, userData) => {
    return await apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id) => {
    return await apiCall(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  toggleActive: async (id) => {
    return await apiCall(`/users/${id}/toggle-active`, {
      method: 'PATCH',
    });
  },

  getStats: async () => {
    return await apiCall('/users/stats/overview');
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return await apiCall('/health');
  },
};

export default apiCall;
