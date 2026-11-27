import type { Role } from '../../types.ts'
import type { NavItem } from './Navbar.tsx'

// Links de la navbar según el rol de la sesión. El invitado (sin sesión) solo ve el catálogo.
export const NAV_LINKS: Record<Role, NavItem[]> = {
  COLECCIONISTA: [
    { to: '/', label: 'Catálogo' },
    { to: '/user', label: 'Inicio' },
    { to: '/user/orders', label: 'Pedidos' },
    { to: '/user/profile', label: 'Perfil' },
    { to: '/user/settings', label: 'Ajustes' },
  ],
  VENDEDOR: [
    { to: '/', label: 'Productos' },
    { to: '/seller/dashboard', label: 'Dashboard' },
    { to: '/seller/products', label: 'Catálogo' },
    { to: '/seller/orders', label: 'Órdenes' },
    { to: '/seller/settings', label: 'Ajustes' },
  ],
  ADMIN: [
    { to: '/', label: 'Catálogo' },
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Usuarios' },
    { to: '/admin/sets', label: 'Sets' },
    { to: '/admin/reviews', label: 'Reseñas' },
    { to: '/admin/settings', label: 'Ajustes' },
  ],
}
