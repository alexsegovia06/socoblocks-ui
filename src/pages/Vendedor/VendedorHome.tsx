import { Link } from 'react-router'
import Profile from '../../components/Profile.tsx'

export default function VendedorHome() {
  return (
    <>
      <h1>Panel del vendedor</h1>
      <p className="muted">
        Solo los vendedores ven las páginas bajo /vendedor. Prueba abrir <Link to="/coleccionista">/coleccionista</Link> o{' '}
        <Link to="/coleccionista/profile">/coleccionista/profile</Link>: te manda a este panel.
      </p>
      <Profile />
    </>
  )
}
