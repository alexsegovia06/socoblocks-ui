import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Award } from 'lucide-react'
import { HERO_DESTACADO, formatoPrecio } from '../../data/sets.ts'
import type { SetColeccionable } from '../../data/sets.ts'
import './Hero.css'

interface Props {
  set: SetColeccionable
}

export default function Hero({ set }: Props) {
  const [sinImagen, setSinImagen] = useState(false)

  return (
    <section className="banner">
      <div className="banner__texto">
        <span className="banner__pill">
          <Award size={14} />
          {HERO_DESTACADO.etiqueta}
        </span>

        <h1 className="banner__titulo">
          {HERO_DESTACADO.frase}
          <span>{HERO_DESTACADO.titulo}</span>
        </h1>
        <p className="banner__desc">{HERO_DESTACADO.descripcion}</p>

        <div className="banner__acciones">
          <div className="banner__dato">
            <small>Precio Especial:</small>
            <strong>
              {formatoPrecio(set.precio)} <span>MXN</span>
            </strong>
          </div>
          <div className="banner__dato banner__dato--piezas">
            <small>Piezas:</small>
            <strong>{set.piezas} pcs</strong>
          </div>
          <Link to={`/products/${set.id}`} className="banner__boton">
            Ver Set &amp; Comprar
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="banner__visual">
        <span className="banner__disponibles">{set.stock} disponibles</span>
        {set.imagen && !sinImagen && (
            <img className="banner__img" src={set.imagen} alt={HERO_DESTACADO.titulo} onError={() => setSinImagen(true)} />
        )}
        <div className="banner__caption">
          <div>
            <small>{HERO_DESTACADO.numero}</small>
            <strong>
              {HERO_DESTACADO.titulo} • {HERO_DESTACADO.ubicacion}
            </strong>
            <em>{HERO_DESTACADO.cita}</em>
          </div>
          <span className="banner__piezas">{set.piezas} pcs</span>
        </div>
      </div>
    </section>
  )
}
