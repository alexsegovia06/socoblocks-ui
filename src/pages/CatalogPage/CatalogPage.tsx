import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/AuthContext.tsx'
import Hero from '../../components/Hero/Hero.tsx'
import Filtros from '../../components/Filtros/Filtros.tsx'
import SetsSection from '../../components/SetsSection/SetsSection.tsx'
import { FILTROS_INICIALES, HERO_DESTACADO} from '../../data/sets.ts'
import type { FiltrosState, SetColeccionable } from '../../data/sets.ts'
import './CatalogPage.css'
import { api } from '../../api.ts'
import type { ApiError } from '../../api.ts'
import { toSet } from '../../data/mapSet.ts'
import type { SetApi } from '../../data/mapSet.ts'


export default function CatalogPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [filtros, setFiltros] = useState<FiltrosState>(FILTROS_INICIALES)

  // Estado del catálogo que viene del backend
  const [sets, setSets] = useState<SetColeccionable[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<SetApi[]>('/api/catalogo')
      .then((data) => setSets(data.map(toSet)))
      .catch((e: ApiError) => setError(e.message))
      .finally(() => setCargando(false))
  }, [])


  const destacado = sets.find((s) => s.id === HERO_DESTACADO.setId)

  const visibles = sets.filter(
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
        <Filtros filtros={filtros} onChange={setFiltros} onLimpiar={() => setFiltros(FILTROS_INICIALES)} />
        <SetsSection sets={visibles} onAgregar={agregar} />
      </div>
    </main>
  )
}
