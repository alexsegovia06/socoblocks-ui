import type { Role } from '../../types.ts'
import type { NavItem } from './Navbar.tsx'

// Links de la navbar según el rol de la sesión. El invitado (sin sesión) solo ve el catálogo.
export const NAV_LINKS: Record<Role, NavItem[]> = {
  COLECCIONISTA: [
    { to: '/', label: 'Catálogo' },
    { to: '/user', label: 'Inicio' },
    { to: '/user/profile', label: 'Perfil' },
    { to: '/user/settings', label: 'Ajustes' },
  ],
  VENDEDOR: [
    { to: '/', label: 'Catálogo' },
    { to: '/seller', label: 'Inicio' },
    { to: '/seller/dashboard', label: 'Dashboard' },
    { to: '/seller/products', label: 'Productos' },
    { to: '/seller/settings', label: 'Ajustes' },
  ],
  ADMIN: [
    { to: '/', label: 'Catálogo' },
    { to: '/admin', label: 'Inicio' },
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/settings', label: 'Ajustes' },
  ],
}
