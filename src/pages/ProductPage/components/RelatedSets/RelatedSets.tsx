import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import SetCard from '../../../../components/SetCard/SetCard.tsx'
import type { SetColeccionable } from '../../../../data/sets.ts'
import './RelatedSets.css'

interface Props {
  set: SetColeccionable
  catalogo: SetColeccionable[]
  onAgregar: (set: SetColeccionable) => void
}

const MAXIMO = 4

// Primero los de la misma categoría; si no alcanzan, se completa con el resto del catálogo.
// En cada grupo van primero los que tienen stock y luego los de precio más parecido.
function elegirRelacionados(set: SetColeccionable, catalogo: SetColeccionable[]) {
  const orden = (a: SetColeccionable, b: SetColeccionable) =>
    Number(b.stock > 0) - Number(a.stock > 0) ||
    Math.abs(a.precio - set.precio) - Math.abs(b.precio - set.precio)

  const otros = catalogo.filter((s) => s.id !== set.id)
  const mismaCategoria = otros.filter((s) => s.categoria === set.categoria).sort(orden)
  const resto = otros.filter((s) => s.categoria !== set.categoria).sort(orden)
  return [...mismaCategoria, ...resto].slice(0, MAXIMO)
}

export default function RelatedSets({ set, catalogo, onAgregar }: Props) {
  const relacionados = elegirRelacionados(set, catalogo)
  if (relacionados.length === 0) return null

  return (
    <section className="related-sets" aria-labelledby="related-sets-titulo">
      <header className="related-sets__head">
        <div>
          <h2 id="related-sets-titulo">También te puede gustar</h2>
          <p>Más momentos icónicos para tu repisa</p>
        </div>
        <Link to="/" className="related-sets__todos">
          Ver todo el catálogo
          <ArrowRight size={16} />
        </Link>
      </header>

      <div className="related-sets__grid">
        {relacionados.map((s) => (
          <SetCard key={s.id} set={s} onAgregar={onAgregar} />
        ))}
      </div>
    </section>
  )
}
