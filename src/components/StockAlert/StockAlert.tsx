import { Link } from 'react-router'
import { TriangleAlert } from 'lucide-react'
import { useCatalogo } from '../../catalogo/useCatalogo.ts'
import './StockAlert.css'

interface Props {
  // A dónde lleva "Gestionar stock"; sin él, el botón no se muestra
  to?: string
}

const LIMITE_BAJO = 5

// Avisa de los sets con poco stock o agotados, con los datos reales del catálogo.
// Si todo está bien surtido, no se muestra.
export default function StockAlert({ to }: Props) {
  const { sets } = useCatalogo()
  const bajos = sets.filter((s) => s.stock > 0 && s.stock <= LIMITE_BAJO)
  const agotados = sets.filter((s) => s.stock === 0)

  if (bajos.length === 0 && agotados.length === 0) return null

  return (
    <section className="stock-alert">
      <span className="stock-alert__icon">
        <TriangleAlert size={26} />
      </span>

      <div className="stock-alert__text">
        <h2>Alerta de bajo inventario</h2>
        <p>
          {bajos.length > 0 && (
            <>
              {bajos.length === 1 ? 'El set ' : 'Los sets '}
              {bajos.map((s, i) => (
                <span key={s.id}>
                  {i > 0 && (i === bajos.length - 1 ? ' y ' : ', ')}
                  <strong>"{s.nombre}"</strong> ({s.stock} {s.stock === 1 ? 'unidad' : 'unidades'})
                </span>
              ))}{' '}
              {bajos.length === 1 ? 'tiene' : 'tienen'} poco stock.{' '}
            </>
          )}
          {agotados.length > 0 &&
            `${agotados.length === 1 ? `"${agotados[0].nombre}" está agotado` : `${agotados.length} sets están agotados`}.`}
        </p>
      </div>

      {to && (
        <Link to={to} className="stock-alert__button">
          Gestionar Stock Ahora
        </Link>
      )}
    </section>
  )
}
