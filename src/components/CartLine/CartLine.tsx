import { useState } from 'react'
import { Link } from 'react-router'
import { AlertTriangle, Minus, Plus, Trash2 } from 'lucide-react'
import { useCarrito } from '../../carrito/CarritoContext.tsx'
import type { LineaCarrito } from '../../carrito/useLineasCarrito.ts'
import { formatoPrecio } from '../../data/sets.ts'
import './CartLine.css'

interface Props {
  linea: LineaCarrito
  // Versión chica para el panel lateral
  compacta?: boolean
  // Se llama al abrir el producto (el panel lo usa para cerrarse)
  onNavegar?: () => void
}

export default function CartLine({ linea, compacta = false, onNavegar }: Props) {
  const { cambiarCantidad, quitar } = useCarrito()
  const [sinImagen, setSinImagen] = useState(false)
  const { set, cantidad, sinStockSuficiente } = linea
  const destino = `/products/${set.id}`

  return (
    <li className={`cart-line${compacta ? ' cart-line--compacta' : ''}`}>
      <Link to={destino} className="cart-line__media" onClick={onNavegar} aria-hidden="true" tabIndex={-1}>
        {set.imagen && !sinImagen ? (
          <img src={set.imagen} alt="" loading="lazy" onError={() => setSinImagen(true)} />
        ) : (
          <span>{set.visual[0]}</span>
        )}
      </Link>

      <div className="cart-line__info">
        <Link to={destino} className="cart-line__nombre" onClick={onNavegar}>
          {set.nombre}
        </Link>
        <span className="cart-line__unitario">
          {formatoPrecio(set.precio)} MXN{!compacta && ` · ${set.piezas} piezas`}
        </span>

        {sinStockSuficiente && (
          <span className="cart-line__aviso" role="alert">
            <AlertTriangle size={14} />
            {set.stock === 0 ? 'Agotado: quítalo para continuar' : `Solo quedan ${set.stock} en stock`}
          </span>
        )}

        <div className="cart-line__controles">
          <div className="cart-line__cantidad">
            <button
              type="button"
              aria-label={`Quitar una unidad de ${set.nombre}`}
              disabled={cantidad <= 1}
              onClick={() => cambiarCantidad(set.id, cantidad - 1)}
            >
              <Minus size={14} />
            </button>
            <span aria-live="polite" aria-label={`Cantidad: ${cantidad}`}>
              {cantidad}
            </span>
            <button
              type="button"
              aria-label={`Agregar una unidad de ${set.nombre}`}
              disabled={cantidad >= set.stock}
              onClick={() => cambiarCantidad(set.id, cantidad + 1)}
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            type="button"
            className="cart-line__quitar"
            aria-label={`Quitar ${set.nombre} del carrito`}
            onClick={() => quitar(set.id)}
          >
            <Trash2 size={16} />
            {!compacta && 'Quitar'}
          </button>
        </div>
      </div>

      <strong className="cart-line__total">{formatoPrecio(set.precio * cantidad)}</strong>
    </li>
  )
}
