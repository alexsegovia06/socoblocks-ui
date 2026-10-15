import { Link } from 'react-router'

export default function ColeccionistaHome() {
  return (
    <>
      <h1>Inicio del coleccionista</h1>
      <p className="muted">
        Solo los coleccionistas ven las páginas bajo /coleccionista. Prueba abrir <Link to="/vendedor">/vendedor</Link> o{' '}
        <Link to="/vendedor/productos">/vendedor/productos</Link>: te manda al catálogo.
      </p>
    </>
  )
}
