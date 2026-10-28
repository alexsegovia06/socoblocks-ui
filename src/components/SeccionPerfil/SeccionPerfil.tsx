import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { CATEGORIAS, formatoPrecio } from '../../data/sets.ts'
import type { SetColeccionable } from '../../data/sets.ts'
import './SeccionPerfil.css'

// Piezas compartidas por las secciones del perfil (colección y wishlist):
// la tarjeta con su título y la fila de un set.

interface SeccionProps {
  id: string
  titulo: string
  icono: ReactNode
  contador: string
  children: ReactNode
}

export default function SeccionPerfil({ id, titulo, icono, contador, children }: SeccionProps) {
  return (
    <section className="seccion-perfil" aria-labelledby={id}>
      <header className="seccion-perfil__head">
        <h2 id={id} className="seccion-perfil__titulo">
          {icono}
          {titulo}
        </h2>
        <span className="seccion-perfil__contador">{contador}</span>
      </header>
      {children}
    </section>
  )
}

interface FilaProps {
  set: SetColeccionable
  // Lo que aparece a la derecha: etiquetas y botones, según la sección
  children?: ReactNode
}

export function FilaSet({ set, children }: FilaProps) {
  // Si la imagen no existe o falla, se muestra el emoji del set
  const [sinImagen, setSinImagen] = useState(false)
  const categoria = CATEGORIAS.find((c) => c.id === set.categoria)
  const destino = `/products/${set.id}`

  return (
    <li className="fila-set">
      {/* El enlace de la imagen se oculta para lectores de pantalla y teclado: el del nombre ya cubre lo mismo */}
      <Link to={destino} className="fila-set__media" aria-hidden="true" tabIndex={-1}>
        {set.imagen && !sinImagen ? (
          <img src={set.imagen} alt="" loading="lazy" onError={() => setSinImagen(true)} />
        ) : (
          <span>{set.visual[0]}</span>
        )}
      </Link>

      <div className="fila-set__info">
        <span className="fila-set__categoria">{categoria?.etiqueta}</span>
        <Link to={destino} className="fila-set__nombre">
          {set.nombre}
        </Link>
        <span className="fila-set__precio">
          {formatoPrecio(set.precio)} MXN · {set.piezas} piezas
        </span>
      </div>

      <div className="fila-set__lado">{children}</div>
    </li>
  )
}
