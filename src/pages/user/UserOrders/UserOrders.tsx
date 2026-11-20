import { useMemo } from 'react'
import { Link } from 'react-router'
import { MapPin, Package, Wallet } from 'lucide-react'
import { useAuth } from '../../../auth/AuthContext.tsx'
import OrderStatus from '../../../components/OrderStatus/OrderStatus.tsx'
import { formatoPrecio } from '../../../data/sets.ts'
import { METODO_PAGO, formatoFecha, leerPedidos } from '../../../pedidos/pedidos.ts'
import './UserOrders.css'

export default function UserOrders() {
  const { user } = useAuth()
  const username = user?.username ?? ''
  const pedidos = useMemo(() => (username ? leerPedidos(username) : []), [username])

  return (
    <>
      <header className="pedidos__head">
        <h1>Mis pedidos</h1>
        <p className="muted">
          {pedidos.length === 0
            ? 'Aquí verás tus compras y en qué va cada envío.'
            : `${pedidos.length} ${pedidos.length === 1 ? 'pedido' : 'pedidos'} realizados`}
        </p>
      </header>

      {pedidos.length === 0 ? (
        <section className="pedidos__vacio">
          <Package size={36} />
          <strong>Todavía no tienes pedidos</strong>
          <p>Cuando compres un set aparecerá aquí con su folio y estado de envío.</p>
          <Link to="/" className="pedidos__boton">
            Explorar el catálogo
          </Link>
        </section>
      ) : (
        <ul className="pedidos__lista">
          {pedidos.map((p) => {
            const piezas = p.lineas.reduce((suma, l) => suma + l.cantidad, 0)
            return (
              <li key={p.folio} className="pedido">
                {/* <details>: el resumen siempre se ve y el detalle se despliega al tocarlo */}
                <details>
                  <summary className="pedido__resumen">
                    <div className="pedido__id">
                      <strong>{p.folio}</strong>
                      <small>{formatoFecha(p.fecha)}</small>
                    </div>
                    <span className="pedido__cuenta">
                      {piezas} {piezas === 1 ? 'producto' : 'productos'}
                    </span>
                    <strong className="pedido__total">{formatoPrecio(p.total)}</strong>
                    <OrderStatus estado={p.estado} />
                  </summary>

                  <div className="pedido__detalle">
                    <ul className="pedido__lineas">
                      {p.lineas.map((l) => (
                        <li key={l.setId}>
                          <Link to={`/products/${l.setId}`}>{l.nombre}</Link>
                          <span>× {l.cantidad}</span>
                          <strong>{formatoPrecio(l.precio * l.cantidad)}</strong>
                        </li>
                      ))}
                    </ul>
                    <dl className="pedido__datos">
                      <div>
                        <dt>
                          <MapPin size={14} /> Envío a
                        </dt>
                        <dd>
                          {p.envio.nombre} · {p.envio.calle}, {p.envio.colonia}, {p.envio.ciudad}, {p.envio.estado}{' '}
                          C.P. {p.envio.cp}
                        </dd>
                      </div>
                      <div>
                        <dt>
                          <Wallet size={14} /> Pago
                        </dt>
                        <dd>{METODO_PAGO[p.metodoPago]}</dd>
                      </div>
                    </dl>
                  </div>
                </details>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
