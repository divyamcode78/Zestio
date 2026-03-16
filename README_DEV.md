# Zestio Food Delivery Platform

## Quick Start

### Option 1: Run Both Frontend & Backend Together (Recommended)

```bash
# Install frontend dependencies (if not already done)
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Run both services together
npm run dev:full
```

This will start:
- **Frontend**: http://localhost:3000 (Vite dev server)
- **Backend**: http://localhost:5000 (Express API server)

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

## Development Scripts

- `npm run dev` - Frontend only
- `npm run dev:full` - Both frontend and backend together
- `npm run backend` - Backend only
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features

### ✅ Working Features
- **Restaurant browsing** with mock data
- **Menu items** with categories and filtering
- **Quantity controls** (+ and - buttons, max 5 items)
- **Cart management** with real-time updates
- **User authentication** (mock)
- **Responsive design** for mobile and desktop

### 🔧 Backend APIs
- **Cart API**: Add, update, remove items
- **Auth API**: Login, register, user management
- **Restaurant API**: Restaurant listings and details
- **Menu API**: Menu items and categories
- **Order API**: Order management

### 🎨 UI Components
- **Quantity Controls**: Intuitive + and - buttons
- **Cart Badge**: Real-time item count
- **Restaurant Cards**: Consistent layout with images
- **Menu Items**: Detailed item cards with pricing

## Project Structure

```
zestio/
├── src/                    # Frontend React app
│   ├── components/         # Reusable UI components
│   ├── context/           # React contexts (Auth, Cart)
│   ├── pages/             # Page components
│   ├── lib/               # Utilities and API calls
│   └── types/             # TypeScript type definitions
├── backend/               # Express.js backend
│   ├── config/           # Database configuration
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   └── server.js         # Main server file
└── package.json          # Frontend dependencies and scripts
```

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for development and building
- **TailwindCSS** for styling
- **Radix UI** for components
- **React Router** for navigation

### Backend
- **Express.js** API server
- **MySQL** database
- **JWT** authentication
- **CORS** enabled for frontend

## Environment Variables

Create `.env` files in both root and backend directories:

**Root `.env`:**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend `.env`:**
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=zestio_db
JWT_SECRET=your-secret-key
```

## Troubleshooting

### Port Conflicts
- Frontend defaults to port 3000
- Backend defaults to port 5000
- Change ports in environment variables if needed

### Database Issues
- Ensure MySQL is running
- Create database: `CREATE DATABASE zestio_db;`
- Backend will auto-create tables on first run

### API Errors
- Check backend is running on port 5000
- Verify CORS configuration
- Check network tab in browser dev tools

## Development Notes

- Cart uses localStorage when backend is unavailable
- Mock data provides seamless offline development
- All cart operations sync with backend when available
- Maximum 5 items per menu item enforced in UI
