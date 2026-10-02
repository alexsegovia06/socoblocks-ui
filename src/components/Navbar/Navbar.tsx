import { Link, NavLink } from 'react-router'
import { LayoutGrid, LogOut, Search, ShoppingBag, User } from 'lucide-react'
import { useAuth } from "../../auth/AuthContext.tsx";
import './Navbar.css'

export interface NavItem {
  to: string
  label: string
}

interface Props {
  links?: NavItem[]
}

export default function Navbar({ links }: Props) {
  const { user, logout } = useAuth()

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
          <Link to="/user" className="navbar__link">
            <LayoutGrid size={16} />
            Catálogo
          </Link>
        )}

        <button type="button" className="navbar__cart" aria-label="Carrito">
          <ShoppingBag size={20} />
          <span className="navbar__badge">2</span>
        </button>

        {user ? (
          <>
            <span className="navbar__user">{user.username}</span>
            <button type="button" className="navbar__session" onClick={logout}>
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
