import { Link, useNavigate } from 'react-router'
import { ArrowLeft, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { useCarrito } from '../../carrito/CarritoContext.tsx'
import { useLineasCarrito } from '../../carrito/useLineasCarrito.ts'
import CartLine from '../../components/CartLine/CartLine.tsx'
import { formatoPrecio } from '../../data/sets.ts'
import './CartPage.css'

export default function CartPage() {
  const navigate = useNavigate()
  const { unidades, vaciar } = useCarrito()
  const { lineas, subtotal, puedePagar, cargando } = useLineasCarrito()

  if (cargando && unidades > 0) {
    return (
      <main className="carrito-pagina">
        <p className="muted">Cargando tu carrito…</p>
      </main>
    )
  }

  return (
    <main className="carrito-pagina">
      <header className="carrito-pagina__head">
        <div>
          <h1>Tu carrito</h1>
          <p>
            {unidades} {unidades === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        <Link to="/" className="carrito-pagina__seguir">
          <ArrowLeft size={16} />
          Seguir comprando
        </Link>
      </header>

      {lineas.length === 0 ? (
        <div className="carrito-pagina__vacio">
          <ShoppingBag size={40} />
          <strong>Tu carrito está vacío</strong>
          <p>Explora el catálogo y agrega los momentos que quieras armar.</p>
          <Link to="/" className="carrito-pagina__boton">
            Explorar el catálogo
          </Link>
        </div>
      ) : (
        <div className="carrito-pagina__cuerpo">
          <section className="carrito-pagina__card">
            <ul className="carrito-pagina__lista">
              {lineas.map((linea) => (
                <CartLine key={linea.set.id} linea={linea} />
              ))}
            </ul>
            <button type="button" className="carrito-pagina__vaciar" onClick={vaciar}>
              Vaciar carrito
            </button>
          </section>

          <aside className="carrito-pagina__card carrito-pagina__resumen" aria-labelledby="resumen-titulo">
            <h2 id="resumen-titulo">Resumen</h2>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{formatoPrecio(subtotal)} MXN</dd>
              </div>
              <div>
                <dt>Envío</dt>
                <dd className="carrito-pagina__gratis">Gratis</dd>
              </div>
              <div className="carrito-pagina__total">
                <dt>Total</dt>
                <dd>{formatoPrecio(subtotal)} MXN</dd>
              </div>
            </dl>

            <button
              type="button"
              className="carrito-pagina__boton"
              disabled={!puedePagar}
              onClick={() => navigate('/checkout')}
            >
              Continuar al pago
            </button>
            {!puedePagar && (
              <p className="carrito-pagina__nota">Hay sets sin stock suficiente: ajústalos para continuar.</p>
            )}

            <ul className="carrito-pagina__beneficios">
              <li>
                <Truck size={16} /> Envío gratis a todo México
              </li>
              <li>
                <ShieldCheck size={16} /> Garantía de piezas completas
              </li>
            </ul>
          </aside>
        </div>
      )}
    </main>
  )
}
