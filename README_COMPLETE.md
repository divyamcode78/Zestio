# 🍕 Zestio - Food Delivery Platform

A modern, full-stack food delivery application built with React, TypeScript, and Appwrite. Zestio connects customers with local restaurants, provides delivery management for drivers, and offers comprehensive admin tools.

## 🌟 Features

### For Customers
- 🍽️ Browse restaurants by cuisine type
- 🔍 Search and filter restaurants
- 🛒 Add items to cart and place orders
- 📱 Track order status in real-time
- ⭐ Rate and review restaurants
- 💳 Multiple payment options

### For Restaurant Owners
- 📋 Manage restaurant profile and settings
- 🍕 Create and update menu items
- 📊 Track incoming orders and sales
- ✅ Update order status
- 📈 View analytics and performance metrics

### For Delivery Partners
- 🗺️ View available delivery orders
- 📍 Track delivery locations
- 💰 Manage earnings and payouts
- 📊 View delivery history and performance

### For Administrators
- 👥 Manage users and restaurants
- ✅ Approve new restaurant registrations
- 📊 Platform-wide analytics
- 🔧 System configuration and settings

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible UI components
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management
- **Sonner** - Toast notifications

### Backend
- **Appwrite** - Backend-as-a-Service
  - Authentication & User Management
  - Database (NoSQL)
  - File Storage
  - Real-time subscriptions

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Vite** - Development server and bundling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zestio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Appwrite configuration (optional - app works with mock data):
   ```env
   VITE_APPWRITE_ENDPOINT=http://localhost:80/v1
   VITE_APPWRITE_PROJECT_ID=zestio_local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3001`

## 📋 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 👥 Demo Accounts

The application includes mock accounts for testing all user roles:

### Customer
- **Email**: `john@example.com`
- **Password**: `password123`

### Restaurant Owners
- **Email**: `mario@pizzaparadise.com`
- **Password**: `password123`
- **Email**: `john@burgerbarn.com`
- **Password**: `password123`

### Delivery Partner
- **Email**: `bob@driver.com`
- **Password**: `password123`

### Administrator
- **Email**: `admin@zestio.com`
- **Password**: `password123`

*Note: Any password works for demo accounts in mock mode*

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── customer/       # Customer-specific components
│   ├── restaurant/     # Restaurant-specific components
│   ├── driver/         # Driver-specific components
│   └── admin/          # Admin-specific components
├── context/            # React contexts (Auth, Cart)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
│   ├── appwrite.ts     # Appwrite client configuration
│   └── mockData.ts     # Mock data for development
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── customer/       # Customer pages
│   ├── restaurant/     # Restaurant pages
│   ├── driver/         # Driver pages
│   └── admin/          # Admin pages
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Appwrite Configuration (Optional)
VITE_APPWRITE_ENDPOINT=http://localhost:80/v1
VITE_APPWRITE_PROJECT_ID=zestio_local
```

### Appwrite Setup (Optional)

The application works out-of-the-box with mock data. To use Appwrite:

1. **Install Appwrite locally** or use cloud version
2. **Create a new project** in Appwrite console
3. **Set up the following collections**:
   - `users` - User profiles
   - `restaurants` - Restaurant information
   - `menu_items` - Menu items for restaurants
   - `orders` - Customer orders
   - `order_items` - Items within orders
   - `cart_items` - Shopping cart items
   - `payments` - Payment information
   - `delivery_locations` - Delivery tracking
   - `reviews` - Customer reviews

4. **Create storage buckets**:
   - `restaurant_images` - Restaurant photos
   - `menu_images` - Menu item photos
   - `user_avatars` - User profile pictures

5. **Update environment variables** with your Appwrite endpoint and project ID

## 🎯 User Roles & Permissions

### Customer
- Browse restaurants and menus
- Place orders and track delivery
- Manage profile and addresses
- Leave reviews and ratings

### Restaurant Owner
- Manage restaurant profile
- Create and update menu items
- Process incoming orders
- View sales analytics
- Manage restaurant settings

### Delivery Partner
- View available delivery requests
- Accept and manage deliveries
- Track earnings and payouts
- View delivery history

### Administrator
- Manage all users and restaurants
- Approve new restaurant registrations
- View platform analytics
- Configure system settings

## 🔄 Development Workflow

1. **Feature Development**
   - Create feature branch
   - Develop components and pages
   - Test with mock data
   - Add Appwrite integration if needed

2. **Testing**
   - Test all user roles
   - Verify responsive design
   - Check accessibility
   - Test error handling

3. **Deployment**
   - Build production version
   - Configure production environment variables
   - Deploy to hosting platform

## 🐛 Troubleshooting

### Common Issues

**"Failed to fetch" errors**
- Check if Appwrite is configured (optional)
- Verify network connection
- Ensure development server is running

**Authentication issues**
- Use demo accounts from `MOCK_ACCOUNTS.md`
- Clear browser localStorage if needed
- Check environment variables

**Build errors**
- Run `npm install` to update dependencies
- Check TypeScript configuration
- Verify all imports are correct

### Getting Help

1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Review the demo accounts in `MOCK_ACCOUNTS.md`

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📟 Tablets (768px+)
- 💻 Desktop computers (1024px+)

## 🔒 Security Features

- Role-based access control
- Input validation and sanitization
- Secure authentication flow
- Protected API endpoints
- XSS protection

## 🚀 Performance

- Lazy loading of components
- Optimized bundle size
- Efficient state management
- Image optimization
- Code splitting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review demo accounts in `MOCK_ACCOUNTS.md`
- Check the console for error messages
- Verify your setup matches the requirements

---

**Built with ❤️ using React, TypeScript, and Appwrite**
