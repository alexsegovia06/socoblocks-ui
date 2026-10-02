import { NavLink } from 'react-router'
import './AuthTabs.css'

export default function AuthTabs() {
  return (
    <div className="tabs">
      <NavLink to="/login" className={({ isActive }) => `tabs__item${isActive ? ' tabs__item--active' : ''}`}>
        Iniciar Sesión
      </NavLink>
      <NavLink to="/register" className={({ isActive }) => `tabs__item${isActive ? ' tabs__item--active' : ''}`}>
        Registrarse
      </NavLink>
    </div>
  )
}
