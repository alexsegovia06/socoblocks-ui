import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { useAuth } from '../../auth/AuthContext.tsx'
import { CATEGORIAS, RESENAS, SETS } from '../../data/sets.ts'
import ProductGallery from './components/ProductGallery/ProductGallery.tsx'
import ProductInfo from './components/ProductInfo/ProductInfo.tsx'
import ProductReviews from './components/ProductReviews/ProductReviews.tsx'
import './ProductPage.css'

export default function ProductPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  // TODO: reemplazar por la petición al backend cuando exista el endpoint de sets.
  const set = SETS.find((s) => s.id === Number(id))
  if (!set) return <Navigate to="/" replace />

  const categoria = CATEGORIAS.find((c) => c.id === set.categoria)
  const resenas = RESENAS.filter((r) => r.setId === set.id)

  function agregar(cantidad: number) {
    if (!user) {
      navigate('/login')
      return
    }
    console.log('Agregar al carrito:', set?.nombre, cantidad)
  }

  return (
    <main className="producto">
      <nav className="producto__migas" aria-label="Ruta de navegación">
        <Link to="/">Catálogo</Link>
        <span>/</span>
        <span>{categoria?.etiqueta}</span>
        <span>/</span>
        <span className="producto__migas-actual" aria-current="page">{set.nombre}</span>
      </nav>

      <section className="producto__card">
        <ProductGallery key={set.id} set={set} />
        <ProductInfo key={set.id} set={set} categoria={categoria?.etiqueta} onAgregar={agregar} />
      </section>

      <ProductReviews resenas={resenas} />
    </main>
  )
}
