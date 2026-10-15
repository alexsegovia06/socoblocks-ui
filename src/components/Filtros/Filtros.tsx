import { SlidersHorizontal } from 'lucide-react'
import ListadoOpciones from '../ListadoOpciones/ListadoOpciones.tsx'
import { CATEGORIAS, PRECIO_MAX, PRECIO_MIN, formatoPrecio } from '../../data/sets.ts'
import type { CategoriaId, FiltrosState } from '../../data/sets.ts'
import './Filtros.css'

interface Props {
  filtros: FiltrosState
  onChange: (filtros: FiltrosState) => void
  onLimpiar: () => void
}

const OPCIONES_CATEGORIA = [
  { value: 'todas', label: 'Todas las categorías' },
  ...CATEGORIAS.map((c) => ({ value: c.id, label: c.nombre })),
]

export default function Filtros({ filtros, onChange, onLimpiar }: Props) {
  const seleccionadas = filtros.categorias.length === 0 ? ['todas'] : filtros.categorias

  function toggleCategoria(value: string) {
    if (value === 'todas') {
      onChange({ ...filtros, categorias: [] })
      return
    }
    const id = value as CategoriaId
    const categorias = filtros.categorias.includes(id)
      ? filtros.categorias.filter((c) => c !== id)
      : [...filtros.categorias, id]
    onChange({ ...filtros, categorias })
  }

  return (
    <aside className="filtros">
      <div className="filtros__head">
        <h2 className="filtros__titulo">
          <SlidersHorizontal size={16} />
          Filtros
        </h2>
        <button type="button" className="filtros__limpiar" onClick={onLimpiar}>
          Limpiar
        </button>
      </div>

      <ListadoOpciones
        titulo="Categoría"
        opciones={OPCIONES_CATEGORIA}
        seleccionadas={seleccionadas}
        onToggle={toggleCategoria}
      />

      <div className="filtros__precio">
        <div className="filtros__precio-head">
          <label className="filtros__label" htmlFor="filtro-precio">
            Precio máximo
          </label>
          <span className="filtros__valor">{formatoPrecio(filtros.precioMax)} MXN</span>
        </div>
        <input
          id="filtro-precio"
          className="filtros__range"
          type="range"
          min={PRECIO_MIN}
          max={PRECIO_MAX}
          step={50}
          value={filtros.precioMax}
          onChange={(e) => onChange({ ...filtros, precioMax: Number(e.target.value) })}
        />
        <div className="filtros__rango">
          <span>{formatoPrecio(PRECIO_MIN)} MXN</span>
          <span>{formatoPrecio(PRECIO_MAX)} MXN</span>
        </div>
      </div>

      <ListadoOpciones
        titulo="Disponibilidad"
        opciones={[{ value: 'stock', label: 'Solo sets en stock' }]}
        seleccionadas={filtros.soloStock ? ['stock'] : []}
        onToggle={() => onChange({ ...filtros, soloStock: !filtros.soloStock })}
      />
    </aside>
  )
}
