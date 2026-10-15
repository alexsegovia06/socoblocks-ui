import { Link } from 'react-router'

export default function UserHome() {
  return (
    <>
      <h1>Inicio del coleccionista</h1>
      <p className="muted">
        Solo los coleccionistas ven las páginas bajo /user. Prueba abrir <Link to="/seller">/seller</Link> o{' '}
        <Link to="/seller/products">/seller/products</Link>: te manda al catálogo.
      </p>
    </>
  )
}
