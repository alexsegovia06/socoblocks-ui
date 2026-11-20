import { Navigate, Route, Routes } from 'react-router'
import { PublicOnly, Redirect, RequireRole } from './auth/guards.tsx'
import Layout from './components/Layout/Layout.tsx'
import CatalogPage from './pages/CatalogPage/CatalogPage.tsx'
import ProductPage from './pages/ProductPage/ProductPage.tsx'
import LoginPage from './pages/LoginPage/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.tsx'
import CartPage from './pages/CartPage/CartPage.tsx'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage.tsx'
import UserHome from './pages/user/UserHome/UserHome.tsx'
import UserProfile from './pages/user/UserProfile/UserProfile.tsx'
import UserOrders from './pages/user/UserOrders/UserOrders.tsx'
import UserSettings from './pages/user/UserSettings/UserSettings.tsx'
import SellerDashboard from './pages/seller/SellerDashboard/SellerDashboard.tsx'
import SellerProducts from './pages/seller/SellerProducts/SellerProducts.tsx'
import SellerOrders from './pages/seller/SellerOrders/SellerOrders.tsx'
import SellerSettings from './pages/seller/SellerSettings/SellerSettings.tsx'
import AdminHome from './pages/admin/AdminHome/AdminHome.tsx'
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard.tsx'
import AdminSettings from './pages/admin/AdminSettings/AdminSettings.tsx'

export default function App() {
  return (
    <Routes>
      {/* Público: invitado y cualquier rol ven el catálogo */}
      <Route element={<Layout />}>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/products/:id" element={<ProductPage />} />

        {/* Login y registro: solo sin sesión (invitado) */}
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Carrito y pago: cualquier rol con sesión */}
        <Route element={<RequireRole roles={['COLECCIONISTA', 'VENDEDOR', 'ADMIN']} />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
      </Route>

      <Route element={<RequireRole roles={['COLECCIONISTA']} />}>
        <Route path="/user" element={<Layout contained />}>
          <Route index element={<UserHome />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>
      </Route>

      <Route element={<RequireRole roles={['VENDEDOR']} />}>
        <Route path="/seller" element={<Layout contained />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>
      </Route>

      <Route element={<RequireRole roles={['ADMIN']} />}>
        <Route path="/admin" element={<Layout contained />}>
          <Route index element={<AdminHome />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Redirect />} />
    </Routes>
  )
}
