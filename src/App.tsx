import { Route, Routes } from 'react-router'
import { PublicOnly, Redirect, RequireRole } from './auth/guards.tsx'
import Layout from './components/Layout/Layout.tsx'
import CatalogPage from './pages/CatalogPage/CatalogPage.tsx'
import LoginPage from './pages/LoginPage/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.tsx'
import UserHome from './pages/user/UserHome/UserHome.tsx'
import UserProfile from './pages/user/UserProfile/UserProfile.tsx'
import UserSettings from './pages/user/UserSettings/UserSettings.tsx'
import SellerHome from './pages/seller/SellerHome/SellerHome.tsx'
import SellerDashboard from './pages/seller/SellerDashboard/SellerDashboard.tsx'
import SellerProducts from './pages/seller/SellerProducts/SellerProducts.tsx'
import SellerSettings from './pages/seller/SellerSettings/SellerSettings.tsx'
import AdminHome from './pages/admin/AdminHome/AdminHome.tsx'
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard.tsx'
import AdminSettings from './pages/admin/AdminSettings/AdminSettings.tsx'

const userLinks = [
  { to: '/', label: 'Catálogo' },
  { to: '/user', label: 'Inicio' },
  { to: '/user/profile', label: 'Perfil' },
  { to: '/user/settings', label: 'Ajustes' },
]

const sellerLinks = [
  { to: '/', label: 'Catálogo' },
  { to: '/seller', label: 'Inicio' },
  { to: '/seller/dashboard', label: 'Dashboard' },
  { to: '/seller/products', label: 'Productos' },
  { to: '/seller/settings', label: 'Ajustes' },
]

const adminLinks = [
  { to: '/', label: 'Catálogo' },
  { to: '/admin', label: 'Inicio' },
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/settings', label: 'Ajustes' },
]

export default function App() {
  return (
    <Routes>
      {/* Público: invitado y cualquier rol ven el catálogo */}
      <Route element={<Layout />}>
        <Route path="/" element={<CatalogPage />} />

        {/* Login y registro: solo sin sesión (invitado) */}
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<RequireRole roles={['COLECCIONISTA']} />}>
        <Route path="/user" element={<Layout links={userLinks} />}>
          <Route index element={<UserHome />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>
      </Route>

      <Route element={<RequireRole roles={['VENDEDOR']} />}>
        <Route path="/seller" element={<Layout links={sellerLinks} />}>
          <Route index element={<SellerHome />} />
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>
      </Route>

      <Route element={<RequireRole roles={['ADMIN']} />}>
        <Route path="/admin" element={<Layout links={adminLinks} />}>
          <Route index element={<AdminHome />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Redirect />} />
    </Routes>
  )
}
