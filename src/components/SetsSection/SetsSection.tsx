import SetCard from '../SetCard/SetCard.tsx'
import type { SetColeccionable } from '../../data/sets.ts'
import './SetsSection.css'

interface Props {
  sets: SetColeccionable[]
  onAgregar: (set: SetColeccionable) => void
}

export default function SetsSection({ sets, onAgregar }: Props) {
  return (
    <section className="sets">
      <div className="sets__head">
        <h2 className="sets__titulo">
          Sets Coleccionables
          <span className="sets__contador">
            {sets.length} {sets.length === 1 ? 'set' : 'sets'}
          </span>
        </h2>
        <p className="sets__orden">
          Orden: <strong>Más Populares</strong>
        </p>
      </div>

      {sets.length === 0 ? (
        <p className="sets__vacio">No hay sets que coincidan con los filtros.</p>
      ) : (
        <div className="sets__grid">
          {sets.map((set) => (
            <SetCard key={set.id} set={set} onAgregar={onAgregar} />
          ))}
        </div>
      )}
    </section>
  )
}
