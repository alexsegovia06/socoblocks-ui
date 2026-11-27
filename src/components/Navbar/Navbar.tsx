import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { LayoutGrid, LogOut, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useAuth } from "../../auth/AuthContext.tsx";
import { useCarrito } from '../../carrito/CarritoContext.tsx'
import { useToast } from '../../toast/ToastContext.tsx'
import { NAV_LINKS } from './navLinks.ts'
import ThemeToggle from '../ThemeToggle/ThemeToggle.tsx'
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
  // Menú hamburguesa (solo se usa en teléfono)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    if (!menuAbierto) return
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuAbierto(false)
    }
    window.addEventListener('keydown', alPresionar)
    return () => window.removeEventListener('keydown', alPresionar)
  }, [menuAbierto])

  function salir() {
    setMenuAbierto(false)
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
        {/* Al elegir un link el menú se cierra */}
        <div
          id="navbar-menu"
          className={`navbar__menu${menuAbierto ? ' navbar__menu--abierto' : ''}`}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('a')) setMenuAbierto(false)
          }}
        >
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

        <ThemeToggle />

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

        <button
          type="button"
          className="navbar__burger"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          aria-controls="navbar-menu"
          onClick={() => setMenuAbierto((v) => !v)}
        >
          {menuAbierto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  )
}
