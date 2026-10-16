import { Outlet } from 'react-router'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import './Layout.css'

interface Props {
  // Envuelve la página en <main className="main">. Las páginas a pantalla completa (catálogo) ponen su propio <main>.
  contained?: boolean
}

export default function Layout({ contained }: Props) {
  return (
    <div className="layout">
      <Header />
      <div className="layout__content">
        {contained ? (
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
