import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { useAuth } from '../../auth/AuthContext.tsx'
import { CATEGORIAS, RESENAS } from '../../data/sets.ts'
import { useCatalogo } from '../../catalogo/useCatalogo.ts'
import { useColection } from '../../colection/useColection.ts'
import { useWishlist } from '../../wishlist/useWishlist.ts'
import ProductGallery from './components/ProductGallery/ProductGallery.tsx'
import ProductInfo from './components/ProductInfo/ProductInfo.tsx'
import ProductReviews from './components/ProductReviews/ProductReviews.tsx'
import './ProductPage.css'

export default function ProductPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const wishlist = useWishlist()
  const coleccion = useColection()
  const { sets, cargando, error } = useCatalogo()

  // Mismos datos que el catálogo: el set se busca por su id del backend
  const set = sets.find((s) => s.id === Number(id))

  // Mientras llega el catálogo, o si falló, no sabemos si el set existe: no redirigimos todavía
  if (!set) {
    if (cargando) return <main className="producto"><p className="muted">Cargando set…</p></main>
    if (error) return <main className="producto"><p className="error">{error}</p></main>
    return <Navigate to="/" replace />
  }

  const categoria = CATEGORIAS.find((c) => c.id === set.categoria)
  const resenas = RESENAS.filter((r) => r.setId === set.id)
  const setId = set.id

  function agregar(cantidad: number) {
    if (!user) {
      navigate('/login')
      return
    }
    console.log('Agregar al carrito:', set?.nombre, cantidad)
  }

  function alternarFavorito() {
    if (!user) {
      navigate('/login')
      return
    }
    wishlist.toggle(setId)
  }

  function alternarColeccion() {
    if (!user) {
      navigate('/login')
      return
    }
    if (coleccion.has(setId)) {
      coleccion.remove(setId)
    } else {
      coleccion.add(setId)
      wishlist.remove(setId) // si ya lo tienes, deja de ser un deseo
    }
  }

  // Vendedores y admins no tienen wishlist ni colección: para ellos los botones no se muestran
  const puedeGuardar = !user || user.role === 'COLECCIONISTA'
  const enColeccion = coleccion.has(set.id)

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
        <ProductGallery key={`galeria-${set.id}`} set={set} />
        <ProductInfo
          key={`info-${set.id}`}
          set={set}
          categoria={categoria?.etiqueta}
          onAgregar={agregar}
          favorito={wishlist.has(set.id)}
          // Un set que ya tienes no se guarda como deseo, por eso se oculta el corazón
          onToggleFavorito={puedeGuardar && !enColeccion ? alternarFavorito : undefined}
          enColeccion={enColeccion}
          onToggleColeccion={puedeGuardar ? alternarColeccion : undefined}
        />
      </section>

      <ProductReviews resenas={resenas} />
    </main>
  )
}
