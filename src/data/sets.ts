export type CategoriaId = 'clasicos' | 'tv' | 'entrevistas'

export interface Categoria {
  id: CategoriaId
  nombre: string
  etiqueta: string
}

export interface SetColeccionable {
  id: number
  nombre: string
  categoria: CategoriaId
  piezas: number
  precio: number
  stock: number
  rating: number
  resenas: number
  descripcion: string
  // Emojis que representan el set mientras no hay fotos del modelo.
  visual: [string, string]
  imagen?: string
}

export interface FiltrosState {
  categorias: CategoriaId[]
  precioMax: number
  soloStock: boolean
}

export const PRECIO_MIN = 500
export const PRECIO_MAX = 1500

export const FILTROS_INICIALES: FiltrosState = {
  categorias: [],
  precioMax: PRECIO_MAX,
  soloStock: false,
}

export const CATEGORIAS: Categoria[] = [
  { id: 'clasicos', nombre: 'Clásicos de Internet', etiqueta: 'Clásicos' },
  { id: 'tv', nombre: 'TV Nacional', etiqueta: 'TV Nacional' },
  { id: 'entrevistas', nombre: 'Entrevistas de Leyenda', etiqueta: 'Entrevistas' },
]

export interface Resena {
  id: number
  setId: number
  autor: string
  rating: number
  comentario: string
}

// TODO: reemplazar por la petición al backend cuando exista el endpoint de reseñas.
export const RESENAS: Resena[] = [
  {
    id: 1,
    setId: 1,
    autor: 'Juan Pérez',
    rating: 5,
    comentario: '¡Idéntico al video, me encantaron los detalles de la rama rota! Quedó genial en mi repisa de cultura pop.',
  },
]

// Textos del banner principal. Se editan aquí.
export const HERO_DESTACADO = {
  setId: 4,
  etiqueta: 'Set del año 2026 • Edición limitada',
  frase: '"¡Ya güey, por favor!"',
  titulo: 'La Caída de Edgar',
  descripcion:
    'Revive el video que inauguró el internet moderno en México. Incluye el puente de ramas quebradizas, el río de aguas turbias con piezas translúcidas, y la minifigura con playera de rayas lista para caer.',
  numero: 'Set No. 001 Oficial',
  ubicacion: 'San Socorro',
  cita: '"¡Ya güey, por favor... te vas a caer!"',
}

export const formatoPrecio = (n: number) => `$${n.toLocaleString('es-MX')}`
