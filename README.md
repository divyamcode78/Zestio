# Zestio - Food Delivery Application

A modern, full-stack food delivery application built with React, TypeScript, and Appwrite.

## Features

### Customer Features
- Browse restaurants by cuisine
- Search and filter restaurants
- View menu items and pricing
- Add items to cart
- Place orders with special instructions
- Track delivery in real-time
- View order history
- Rate and review restaurants

### Restaurant Features
- Manage menu items (add/edit/delete)
- Update item availability
- View and manage orders
- Real-time order notifications
- Track order status updates
- View restaurant analytics

### Driver Features
- View available delivery orders
- Accept/reject delivery requests
- Track delivery progress
- View earnings and performance metrics
- Delivery history and ratings

### Admin Features
- User management and roles
- Restaurant approval and management
- Platform analytics and reporting
- System configuration
- Monitor platform activity

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Radix UI** components
- **React Router** for navigation
- **React Hook Form** for forms
- **Sonner** for notifications
- **Lucide React** for icons

### Backend
- **Appwrite** for backend services
- **Appwrite Database** for data storage
- **Appwrite Authentication** for user management
- **Appwrite Storage** for file uploads
- **Appwrite Realtime** for live updates

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Appwrite account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zestio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Appwrite**
   - Create a new Appwrite project at [appwrite.io](https://appwrite.io)
   - Copy your Project ID and Endpoint
   - Create the following collections:
     - `users` (for user profiles)
     - `restaurants` (for restaurant information)
     - `menu_items` (for menu items)
     - `orders` (for customer orders)
     - `order_items` (for order details)
     - `cart_items` (for shopping cart)
     - `payments` (for payment records)
     - `delivery_locations` (for delivery addresses)
     - `reviews` (for customer reviews)
   - Create storage buckets:
     - `restaurant_images`
     - `menu_images`
     - `user_avatars`

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Appwrite credentials:
   ```env
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id_here
   ```

5. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── layout/         # Layout components for different roles
│   └── customer/       # Customer-specific components
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── customer/       # Customer pages
│   ├── restaurant/     # Restaurant pages
│   ├── driver/         # Driver pages
│   └── admin/          # Admin pages
├── context/            # React context providers
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## User Roles

1. **Customer** - Browse restaurants, place orders, track deliveries
2. **Restaurant** - Manage menu, process orders, update status
3. **Driver** - Accept deliveries, track earnings, manage routes
4. **Admin** - Manage users, restaurants, and platform settings

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
```

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Docker
```bash
# Build image
docker build -t zestio .

# Run container
docker run -p 3000:3000 zestio
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the [documentation](docs/)
- Review existing issues and discussions

## Roadmap

- [ ] Payment integration (Stripe, PayPal)
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced search and filters
- [ ] Loyalty program
- [ ] Scheduled orders
- [ ] Group ordering
