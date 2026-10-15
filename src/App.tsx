import { Route, Routes } from 'react-router'
import { PublicOnly, Redirect, RequireRole } from './auth/guards.tsx'
import Layout from './components/Layout/Layout.tsx'
import CatalogPage from './pages/CatalogPage/CatalogPage.tsx'
import LoginPage from './pages/LoginPage/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage/RegisterPage.tsx'
import ColeccionistaHome from './pages/Coleccionista/ColeccionistaHome.tsx'
import ColeccionistaProfile from './pages/Coleccionista/ColeccionistaProfile.tsx'
import ColeccionistaSettings from './pages/Coleccionista/ColeccionistaSettings.tsx'
import VendedorHome from './pages/Vendedor/VendedorHome.tsx'
import VendedorProductos from './pages/Vendedor/VendedorProductos.tsx'
import VendedorSettings from './pages/Vendedor/VendedorSettings.tsx'

const coleccionistaLinks = [
    { to: '/', label: 'Catálogo' },
    { to: '/coleccionista', label: 'Inicio' },
    { to: '/coleccionista/profile', label: 'Perfil' },
    { to: '/coleccionista/settings', label: 'Ajustes' },
]

const vendedorLinks = [
    { to: '/', label: 'Catálogo' },
    { to: '/vendedor', label: 'Inicio' },
    { to: '/vendedor/productos', label: 'Productos' },
    { to: '/vendedor/settings', label: 'Ajustes' },
]

export default function App() {
    return (
        <Routes>
            {/* Público: invitado, coleccionista y vendedor ven el catálogo */}
            <Route element={<Layout />}>
                <Route path="/" element={<CatalogPage />} />

                {/* Login y registro: solo sin sesión (invitado) */}
                <Route element={<PublicOnly />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
            </Route>

            <Route element={<RequireRole role="COLECCIONISTA" />}>
                <Route path="/coleccionista" element={<Layout links={coleccionistaLinks} />}>
                    <Route index element={<ColeccionistaHome />} />
                    <Route path="profile" element={<ColeccionistaProfile />} />
                    <Route path="settings" element={<ColeccionistaSettings />} />
                </Route>
            </Route>

            <Route element={<RequireRole role="VENDEDOR" />}>
                <Route path="/vendedor" element={<Layout links={vendedorLinks} />}>
                    <Route index element={<VendedorHome />} />
                    <Route path="productos" element={<VendedorProductos />} />
                    <Route path="settings" element={<VendedorSettings />} />
                </Route>
            </Route>

            <Route path="*" element={<Redirect />} />
        </Routes>
    )
}
