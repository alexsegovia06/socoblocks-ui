import { Route, Routes } from 'react-router'
import { PublicOnly, Redirect, RequireRole } from './auth/guards.tsx'
import Layout from './components/Layout/Layout.tsx'
import LoginPage from './pages/LoginPage/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.tsx'
import UserHome from './pages/user/UserHome.tsx'
import UserProfile from './pages/user/UserProfile.tsx'
import UserSettings from './pages/user/UserSettings.tsx'
import AdminHome from './pages/admin/AdminHome/AdminHome.tsx'
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard.tsx'
import AdminSettings from './pages/admin/AdminSettings/AdminSettings.tsx'
import SellerHome from './pages/seller/SellerHome/SellerHome.tsx'
import SellerDashboard from './pages/seller/SellerDashboard/SellerDashboard.tsx'

const userLinks = [
  { to: '/user', label: 'Home' },
  { to: '/user/profile', label: 'Profile' },
  { to: '/user/settings', label: 'Settings' },
]

const adminLinks = [
  { to: '/admin', label: 'Home' },
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/settings', label: 'Settings' },
]

const sellerLinks = [
  { to: '/seller', label: 'Home' },
  { to: '/seller/dashboard', label: 'Dashboard' },
]

export default function App() {
  return (
    <Routes>
      {/* Login y registro: mismo Header/Footer, sin links de sesión */}
      <Route element={<Layout />}>
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

      <Route element={<RequireRole roles={['ADMIN']} />}>
        <Route path="/admin" element={<Layout links={adminLinks} />}>
          <Route index element={<AdminHome />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route element={<RequireRole roles={['VENDEDOR']} />}>
        <Route path="/seller" element={<Layout links={sellerLinks} />}>
          <Route index element={<SellerHome />} />
          <Route path="dashboard" element={<SellerDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Redirect />} />
    </Routes>
  )
}
