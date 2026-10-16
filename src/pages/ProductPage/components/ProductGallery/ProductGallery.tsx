import { useState } from 'react'
import { Box, Camera, Layers, Smile } from 'lucide-react'
import type { SetColeccionable } from '../../../../data/sets.ts'
import './ProductGallery.css'

const VISTAS = [
  { id: 'foto', label: 'Foto', icon: Camera },
  { id: 'modelo', label: 'Modelo', icon: Box },
  { id: 'piezas', label: 'Piezas', icon: Layers },
  { id: 'minifigura', label: 'Minifigura', icon: Smile },
]

interface Props {
  set: SetColeccionable
}

export default function ProductGallery({ set }: Props) {
  const [vista, setVista] = useState(VISTAS[0].id)
  // Si la foto no existe o falla, se muestran los emojis del set.
  const [sinImagen, setSinImagen] = useState(false)

  return (
    <div className="product-gallery">
      <div className="product-gallery__principal">
        {set.imagen && !sinImagen ? (
          <img src={set.imagen} alt={set.nombre} onError={() => setSinImagen(true)} />
        ) : (
          <>
            <div className="product-gallery__visual" aria-hidden="true">
              <span>{set.visual[0]}</span>
              <span>{set.visual[1]}</span>
            </div>
            <div className="product-gallery__etiqueta">
              <small>Set MOC Oficial</small>
              <strong>{set.nombre}</strong>
            </div>
          </>
        )}
      </div>

      <div className="product-gallery__miniaturas">
        {VISTAS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            aria-pressed={vista === id}
            className={`product-gallery__miniatura${vista === id ? ' product-gallery__miniatura--activa' : ''}`}
            onClick={() => setVista(id)}
          >
            <Icon size={30} />
          </button>
        ))}
      </div>
    </div>
  )
}
