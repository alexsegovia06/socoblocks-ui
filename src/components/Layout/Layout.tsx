import { Outlet } from 'react-router'
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import type { NavItem } from './Navbar.tsx'
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
