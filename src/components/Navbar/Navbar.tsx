import { Link, NavLink, useNavigate } from 'react-router'
import { LayoutGrid, LogOut, Search, ShoppingBag, User } from 'lucide-react'
import { useAuth } from "../../auth/AuthContext.tsx";
import { useCarrito } from '../../carrito/CarritoContext.tsx'
import { useToast } from '../../toast/ToastContext.tsx'
import { NAV_LINKS } from './navLinks.ts'
import './Navbar.css'

export interface NavItem {
  to: string
  label: string
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const links = user ? NAV_LINKS[user.role] : null
  const carrito = useCarrito()
  const navigate = useNavigate()
  const toast = useToast()

  function salir() {
    logout()
    toast.info('Cerraste sesión. ¡Vuelve pronto!')
  }

  // Sin sesión no hay carrito: el ícono lleva a iniciar sesión
  function abrirCarrito() {
    if (user) carrito.abrir()
    else navigate('/login')
  }

  return (
    <nav className="navbar">
      <label className="navbar__search">
        <Search size={16} />
        <input type="text" placeholder="Buscar momentos virales (ej. Edgar, Se Vale, Ferras)..." />
      </label>

      <div className="navbar__actions">
        {links ? (
          links.map((link) => (
            <NavLink key={link.to} to={link.to} end className="navbar__link">
              {link.label}
            </NavLink>
          ))
        ) : (
          <Link to="/" className="navbar__link">
            <LayoutGrid size={16} />
            Catálogo
          </Link>
        )}

        <button
          type="button"
          className="navbar__cart"
          aria-label={carrito.unidades > 0 ? `Carrito: ${carrito.unidades} productos` : 'Carrito'}
          aria-haspopup="dialog"
          onClick={abrirCarrito}
        >
          <ShoppingBag size={20} />
          {carrito.unidades > 0 && (
            <span className="navbar__badge" aria-hidden="true">
              {carrito.unidades > 99 ? '99+' : carrito.unidades}
            </span>
          )}
        </button>

        {user ? (
          <>
            <span className="navbar__user">{user.username}</span>
            <button type="button" className="navbar__session" onClick={salir}>
              <LogOut size={14} />
              Salir
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar__session">
            <User size={14} />
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  )
}
