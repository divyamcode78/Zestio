import { Routes, Route, Navigate } from 'react-router'
import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { startOrderStatusChecker } from '@/lib/orderManager'
import { CustomerLayout } from '@/components/layout/CustomerLayout'
import { RestaurantLayout } from '@/components/layout/RestaurantLayout'
import { DriverLayout } from '@/components/layout/DriverLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { RestaurantSignupPage } from '@/pages/auth/RestaurantSignupPage'
import { DeliveryPartnerSignupPage } from '@/pages/auth/DeliveryPartnerSignupPage'

// Customer Pages
import { HomePage } from '@/pages/customer/HomePage'
import { ZestioPlusPage } from '@/pages/customer/ZestioPlusPage'
import { AboutUsPage } from '@/pages/customer/AboutUsPage'
import { HelpSupportPage } from '@/pages/customer/HelpSupportPage'
import { DineOutPage } from '@/pages/customer/DineOutPage'
import { PrivacyPolicyPage } from '@/pages/customer/PrivacyPolicyPage'
import { TermsOfServicePage } from '@/pages/customer/TermsOfServicePage'
import { CookiePolicyPage } from '@/pages/customer/CookiePolicyPage'
import { RestaurantPage } from '@/pages/customer/RestaurantPage'
import { CheckoutPage } from '@/pages/customer/CheckoutPage'
import { PaymentPage } from '@/pages/customer/PaymentPage'
import { OrderSuccessPage } from '@/pages/customer/OrderSuccessPage'
import { OrdersPage } from '@/pages/customer/OrdersPage'
import { TrackingPage } from '@/pages/customer/TrackingPage'
import { ContactSupportPage } from '@/pages/customer/ContactSupportPage'

// Restaurant Pages
import { RestaurantDashboard } from '@/pages/restaurant/DashboardPage'
import { MenuManagementPage } from '@/pages/restaurant/MenuPage'
import { RestaurantOrdersPage } from '@/pages/restaurant/OrdersPage'

// Driver Pages
import { DriverDashboard } from '@/pages/driver/DashboardPage'
import { DeliveriesPage } from '@/pages/driver/DeliveriesPage'
import { EarningsPage } from '@/pages/driver/EarningsPage'

// Admin Pages
import { AdminDashboard } from '@/pages/admin/DashboardPage'
import { UsersPage } from '@/pages/admin/UsersPage'
import { AdminRestaurantsPage } from '@/pages/admin/RestaurantsPage'
import { AdminOrdersPage } from '@/pages/admin/OrdersPage'
import { AdminMenuPage } from '@/pages/admin/MenuPage'

// Setup Page
import { SetupPage } from '@/pages/SetupPage'

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, profile, isLoading, isConfigured } = useAuth()

  if (!isConfigured) {
    return <Navigate to="/setup" replace />
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Redirect to appropriate dashboard based on role
    const roleRoutes: Record<string, string> = {
      customer: '/',
      restaurant: '/restaurant',
      driver: '/driver',
      admin: '/admin',
    }
    return <Navigate to={roleRoutes[profile.role] || '/'} replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { isConfigured } = useAuth()

  // Initialize order status checker when app starts
  useEffect(() => {
    startOrderStatusChecker()
  }, [])

  return (
    <Routes>
      {/* Setup */}
      <Route path="/setup" element={<SetupPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={isConfigured ? <LoginPage /> : <Navigate to="/setup" replace />} />
      <Route path="/register" element={isConfigured ? <RegisterPage /> : <Navigate to="/setup" replace />} />
      <Route path="/forgot-password" element={isConfigured ? <ForgotPasswordPage /> : <Navigate to="/setup" replace />} />
      <Route path="/signup/restaurant" element={isConfigured ? <RestaurantSignupPage /> : <Navigate to="/setup" replace />} />
      <Route path="/signup/delivery" element={isConfigured ? <DeliveryPartnerSignupPage /> : <Navigate to="/setup" replace />} />

      {/* Customer Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="zestio-plus" element={<ZestioPlusPage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="help-support" element={<HelpSupportPage />} />
        <Route path="dineout" element={<DineOutPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms-of-service" element={<TermsOfServicePage />} />
        <Route path="cookie-policy" element={<CookiePolicyPage />} />
        <Route path="restaurant/:id" element={<RestaurantPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        <Route path="contact-support" element={<ContactSupportPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id/tracking" element={<TrackingPage />} />
      </Route>

      {/* Restaurant Routes */}
      <Route
        path="/restaurant"
        element={
          <ProtectedRoute allowedRoles={['restaurant']}>
            <RestaurantLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RestaurantDashboard />} />
        <Route path="menu" element={<MenuManagementPage />} />
        <Route path="orders" element={<RestaurantOrdersPage />} />
      </Route>

      {/* Driver Routes */}
      <Route
        path="/driver"
        element={
          <ProtectedRoute allowedRoles={['driver']}>
            <DriverLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DriverDashboard />} />
        <Route path="deliveries" element={<DeliveriesPage />} />
        <Route path="earnings" element={<EarningsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="restaurants" element={<AdminRestaurantsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="menu" element={<AdminMenuPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </CartProvider>
    </AuthProvider>
  )
}
