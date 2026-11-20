import { useState } from 'react'
import { useCatalogo } from '../../catalogo/useCatalogo.ts'
import { useAgregarAlCarrito } from '../../carrito/useAgregarAlCarrito.ts'
import Hero from '../../components/Hero/Hero.tsx'
import Filters from '../../components/Filters/Filters.tsx'
import SetsSection from '../../components/SetsSection/SetsSection.tsx'
import { FILTROS_INICIALES, HERO_DESTACADO } from '../../data/sets.ts'
import type { FiltrosState, SetColeccionable } from '../../data/sets.ts'
import './CatalogPage.css'

export default function CatalogPage() {
  const [filtros, setFiltros] = useState<FiltrosState>(FILTROS_INICIALES)
  const { sets, cargando, error, recargar } = useCatalogo()
  const agregarAlCarrito = useAgregarAlCarrito()

  const destacado = sets.find((s) => s.id === HERO_DESTACADO.setId)

  const visibles = sets.filter(
    (s) =>
      (filtros.categorias.length === 0 || filtros.categorias.includes(s.categoria)) &&
      s.precio <= filtros.precioMax &&
      (!filtros.soloStock || s.stock > 0),
  )

  return (
    <main className="catalogo">
      {destacado && <Hero set={destacado} />}

      <div className="catalogo__cuerpo">
        <Filters filtros={filtros} onChange={setFiltros} onLimpiar={() => setFiltros(FILTROS_INICIALES)} />
        <SetsSection
          sets={visibles}
          onAgregar={(set: SetColeccionable) => agregarAlCarrito(set)}
          cargando={cargando}
          // Si ya había sets guardados y solo falló la actualización, se siguen mostrando
          error={sets.length === 0 ? error : null}
          onReintentar={recargar}
        />
      </div>
    </main>
  )
}
