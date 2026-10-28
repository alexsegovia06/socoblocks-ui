import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/AuthContext.tsx'
import Hero from '../../components/Hero/Hero.tsx'
import Filters from '../../components/Filters/Filters.tsx'
import SetsSection from '../../components/SetsSection/SetsSection.tsx'
import { FILTROS_INICIALES, HERO_DESTACADO, SETS } from '../../data/sets.ts'
import type { FiltrosState, SetColeccionable } from '../../data/sets.ts'
import './CatalogPage.css'

export default function CatalogPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [filtros, setFiltros] = useState<FiltrosState>(FILTROS_INICIALES)

  const destacado = SETS.find((s) => s.id === HERO_DESTACADO.setId)

  const visibles = SETS.filter(
    (s) =>
      (filtros.categorias.length === 0 || filtros.categorias.includes(s.categoria)) &&
      s.precio <= filtros.precioMax &&
      (!filtros.soloStock || s.stock > 0),
  )

  function agregar(set: SetColeccionable) {
    if (!user) {
      navigate('/login')
      return
    }
    console.log('Agregar al carrito:', set.nombre)
  }

  return (
    <main className="catalogo">
      {destacado && <Hero set={destacado} />}

      <div className="catalogo__cuerpo">
        <Filters filtros={filtros} onChange={setFiltros} onLimpiar={() => setFiltros(FILTROS_INICIALES)} />
        <SetsSection sets={visibles} onAgregar={agregar} />
      </div>
    </main>
  )
}
