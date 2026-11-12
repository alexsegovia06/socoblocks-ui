import { useState } from 'react'
import { Heart, Minus, PackageCheck, Plus, ShieldCheck, ShoppingBag, Star } from 'lucide-react'
import { formatoPrecio } from '../../../../data/sets.ts'
import type { SetColeccionable } from '../../../../data/sets.ts'
import './ProductInfo.css'

interface Props {
  set: SetColeccionable
  categoria?: string
  onAgregar: (cantidad: number) => void
  favorito?: boolean
  // Si no se pasa, el corazón no se muestra
  onToggleFavorito?: () => void
  enColeccion?: boolean
  // Si no se pasa, el botón "Ya lo tengo" no se muestra
  onToggleColeccion?: () => void
}

export default function ProductInfo({
  set,
  categoria,
  onAgregar,
  favorito = false,
  onToggleFavorito,
  enColeccion = false,
  onToggleColeccion,
}: Props) {
  const [cantidad, setCantidad] = useState(1)

  const agotado = set.stock === 0
  const estadoStock = agotado ? 'agotado' : set.stock <= 5 ? 'ultimas' : 'disponible'
  const textoStock = agotado ? 'Agotado' : `${set.stock} unidades en almacén`

  return (
    <div className="product-info">
      <div className="product-info__top">
        <span className="product-info__categoria">{categoria}</span>
        <span className="product-info__rating">
          <Star size={20} />
          <strong>{set.rating.toFixed(1)}</strong>
          <span>({set.resenas} reseñas)</span>
        </span>
      </div>

      <h1 className="product-info__nombre">{set.nombre}</h1>

      <div className="product-info__precio">
        <strong>{formatoPrecio(set.precio)} MXN</strong>
        <span>Envío Gratis a todo México</span>
      </div>

      <div className="product-info__descripcion">
        <h2>Momento icónico recreado:</h2>
        <p>{set.descripcion}</p>
      </div>

      <div className="product-info__datos">
        <div>
          <small>Número de Piezas</small>
          <strong>{set.piezas} piezas de alta precisión</strong>
        </div>
        <div>
          <small>Estado del Stock</small>
          <strong className={`product-info__stock--${estadoStock}`}>{textoStock}</strong>
        </div>
      </div>

      <div className="product-info__compra">
        <div className="product-info__acciones">
          <div className="product-info__cantidad">
            <button
              type="button"
              aria-label="Quitar uno"
              disabled={agotado || cantidad <= 1}
              onClick={() => setCantidad(cantidad - 1)}
            >
              <Minus size={18} />
            </button>
            <span aria-live="polite">{cantidad}</span>
            <button
              type="button"
              aria-label="Agregar uno"
              disabled={agotado || cantidad >= set.stock}
              onClick={() => setCantidad(cantidad + 1)}
            >
              <Plus size={18} />
            </button>
          </div>

          <button
            type="button"
            className="product-info__agregar"
            disabled={agotado}
            onClick={() => onAgregar(cantidad)}
          >
            <ShoppingBag size={24} />
            Agregar al Carrito
          </button>

          {onToggleFavorito && (
            <button
              type="button"
              aria-label={favorito ? 'Quitar de mi wishlist' : 'Guardar en mi wishlist'}
              aria-pressed={favorito}
              className={`product-info__favorito${favorito ? ' product-info__favorito--activo' : ''}`}
              onClick={onToggleFavorito}
            >
              <Heart size={24} />
            </button>
          )}
        </div>

        {onToggleColeccion && (
          <button
            type="button"
            title={enColeccion ? 'Quitar de mi colección' : undefined}
            className={`product-info__coleccion${enColeccion ? ' product-info__coleccion--activo' : ''}`}
            onClick={onToggleColeccion}
          >
            <PackageCheck size={20} />
            {enColeccion ? 'En mi colección' : 'Ya lo tengo'}
          </button>
        )}

        <p className="product-info__garantia">
          <ShieldCheck size={18} />
          Garantía de piezas completas de repuesto gratis.
        </p>
      </div>
    </div>
  )
}
