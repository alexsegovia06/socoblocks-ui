import { AlertTriangle, RotateCw } from 'lucide-react'
import SetCard from '../SetCard/SetCard.tsx'
import type { SetColeccionable } from '../../data/sets.ts'
import './SetsSection.css'

interface Props {
  sets: SetColeccionable[]
  onAgregar: (set: SetColeccionable) => void
  cargando?: boolean
  // Si hay error, se muestra en lugar de la cuadrícula
  error?: string | null
  onReintentar?: () => void
}

// Cuántas tarjetas "fantasma" se pintan mientras llega el catálogo
const PLACEHOLDERS = 6

export default function SetsSection({ sets, onAgregar, cargando = false, error, onReintentar }: Props) {
  return (
    <section className="sets" aria-busy={cargando}>
      <div className="sets__head">
        <h2 className="sets__titulo">
          Sets Coleccionables
          {!cargando && !error && (
            <span className="sets__contador">
              {sets.length} {sets.length === 1 ? 'set' : 'sets'}
            </span>
          )}
        </h2>
        <p className="sets__orden">
          Orden: <strong>Más Populares</strong>
        </p>
      </div>

      {cargando ? (
        <div className="sets__grid">
          <span className="sets__sr">Cargando sets…</span>
          {Array.from({ length: PLACEHOLDERS }, (_, i) => (
            <div key={i} className="sets__skeleton" aria-hidden="true">
              <div className="sets__skeleton-media" />
              <div className="sets__skeleton-body">
                <span className="sets__skeleton-linea sets__skeleton-linea--corta" />
                <span className="sets__skeleton-linea" />
                <span className="sets__skeleton-linea sets__skeleton-linea--media" />
                <div className="sets__skeleton-footer">
                  <span className="sets__skeleton-linea sets__skeleton-linea--precio" />
                  <span className="sets__skeleton-boton" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="sets__error" role="alert">
          <AlertTriangle size={28} />
          <strong>No pudimos cargar el catálogo</strong>
          <p>{error}</p>
          {onReintentar && (
            <button type="button" className="sets__reintentar" onClick={onReintentar}>
              <RotateCw size={16} />
              Reintentar
            </button>
          )}
        </div>
      ) : sets.length === 0 ? (
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
