import { useState } from 'react'
import { Link } from 'react-router'
import { Star } from 'lucide-react'
import EtiquetaStock from '../EtiquetaStock/EtiquetaStock.tsx'
import BotonAgregar from '../BotonAgregar/BotonAgregar.tsx'
import { CATEGORIAS, formatoPrecio } from '../../data/sets.ts'
import type { SetColeccionable } from '../../data/sets.ts'
import './SetCard.css'

interface Props {
  set: SetColeccionable
  onAgregar: (set: SetColeccionable) => void
}

export default function SetCard({ set, onAgregar }: Props) {
  const [sinImagen, setSinImagen] = useState(false)
  const categoria = CATEGORIAS.find((c) => c.id === set.categoria)

  return (
      <article className="set-card">
        <div className="set-card__media">
          {set.imagen && !sinImagen && (
              <img src={set.imagen} alt={set.nombre} onError={() => setSinImagen(true)} />
          )}
          <div className="set-card__stock">
            <EtiquetaStock stock={set.stock} />
          </div>
          <span className="set-card__piezas">{set.piezas} pcs</span>
        </div>

        <div className="set-card__body">
          <span className="set-card__categoria">{categoria?.etiqueta}</span>
          <h3 className="set-card__nombre">
            <Link to={`/products/${set.id}`}>{set.nombre}</Link>
          </h3>

          <div className="set-card__rating" aria-label={`Calificación ${set.rating.toFixed(1)} de 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={14}
                    className={n <= Math.round(set.rating) ? 'set-card__star set-card__star--llena' : 'set-card__star'}
                />
            ))}
            <span>{set.rating.toFixed(1)}</span>
          </div>

          <div className="set-card__footer">
            <div className="set-card__precio">
              <small>Precio</small>
              <strong>
                {formatoPrecio(set.precio)} <span>MXN</span>
              </strong>
            </div>
            <BotonAgregar disabled={set.stock === 0} onClick={() => onAgregar(set)} />
          </div>
        </div>
      </article>
  )
}