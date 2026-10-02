import { Outlet } from 'react-router'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import type { NavItem } from "../Navbar/Navbar.tsx";
import './Layout.css'

interface Props {
  links?: NavItem[]
}

// Header + Footer de IconicBrick. Con `links` (rutas con sesión) el contenido va dentro de .main.
export default function Layout({ links }: Props) {
  return (
    <div className="layout">
      <Header links={links} />
      <div className="layout__content">
        {links ? (
          <main className="main">
            <Outlet />
          </main>
        ) : (
          <Outlet />
        )}
      </div>
      <Footer />
    </div>
  )
}
