import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { ShoppingBag, Truck, X } from 'lucide-react'
import { useCarrito } from '../../carrito/CarritoContext.tsx'
import { useLineasCarrito } from '../../carrito/useLineasCarrito.ts'
import { formatoPrecio } from '../../data/sets.ts'
import CartLine from '../CartLine/CartLine.tsx'
import './CartDrawer.css'

// Panel lateral del carrito: se abre desde el ícono de la navbar o al agregar un set.
export default function CartDrawer() {
  const { abierto, cerrar, unidades } = useCarrito()
  const { lineas, subtotal, puedePagar, cargando } = useLineasCarrito()
  const cerrarRef = useRef<HTMLButtonElement>(null)

  // Al abrir: foco en "cerrar", Esc cierra y la página de atrás no se desplaza
  useEffect(() => {
    if (!abierto) return
    const anterior = document.activeElement as HTMLElement | null
    cerrarRef.current?.focus()
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar()
    }
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('keydown', alTeclear)
      anterior?.focus() // regresa el foco a donde estaba (p. ej. el ícono del carrito)
    }
  }, [abierto, cerrar])

  return (
    <div className={`cart-drawer${abierto ? ' cart-drawer--abierto' : ''}`} aria-hidden={!abierto}>
      <div className="cart-drawer__fondo" onClick={cerrar} />

      <aside
        className="cart-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-titulo"
        inert={!abierto}
      >
        <header className="cart-drawer__head">
          <h2 id="cart-drawer-titulo">
            <ShoppingBag size={20} />
            Tu carrito
            {unidades > 0 && <span className="cart-drawer__contador">{unidades}</span>}
          </h2>
          <button ref={cerrarRef} type="button" className="cart-drawer__cerrar" aria-label="Cerrar carrito" onClick={cerrar}>
            <X size={20} />
          </button>
        </header>

        {cargando && lineas.length === 0 && unidades > 0 ? (
          <p className="cart-drawer__estado">Cargando tu carrito…</p>
        ) : lineas.length === 0 ? (
          <div className="cart-drawer__vacio">
            <span className="cart-drawer__vacio-icono">
              <ShoppingBag size={32} />
            </span>
            <strong>Tu carrito está vacío</strong>
            <p>Agrega un set desde el catálogo y aparecerá aquí.</p>
            <Link to="/" className="cart-drawer__explorar" onClick={cerrar}>
              Explorar el catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__lista">
              {lineas.map((linea) => (
                <CartLine key={linea.set.id} linea={linea} compacta onNavegar={cerrar} />
              ))}
            </ul>

            <footer className="cart-drawer__pie">
              <div className="cart-drawer__subtotal">
                <span>Subtotal</span>
                <strong>{formatoPrecio(subtotal)} MXN</strong>
              </div>
              <p className="cart-drawer__envio">
                <Truck size={15} />
                Envío gratis a todo México
              </p>
              {puedePagar ? (
                <Link to="/checkout" className="cart-drawer__pagar" onClick={cerrar}>
                  Ir a pagar
                </Link>
              ) : (
                <span className="cart-drawer__pagar cart-drawer__pagar--off" aria-disabled="true">
                  Ajusta tu carrito para pagar
                </span>
              )}
              <Link to="/cart" className="cart-drawer__ver" onClick={cerrar}>
                Ver carrito completo
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
