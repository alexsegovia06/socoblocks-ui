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

// TODO: reemplazar por la petición al backend cuando exista el endpoint de sets.
export const SETS: SetColeccionable[] = [
  { id: 1, nombre: 'La caída de Edgar', categoria: 'clasicos', piezas: 350, precio: 899, stock: 15, rating: 5, imagen: '/sets/edgar.png' },
  { id: 2, nombre: 'Se Vale: La Tirolesa', categoria: 'tv', piezas: 420, precio: 1099, stock: 3, rating: 5, imagen: '/sets/se-vale.png' },
  { id: 3, nombre: 'El Ferras', categoria: 'entrevistas', piezas: 200, precio: 649, stock: 0, rating: 5, imagen: '/sets/ferras.png' },
  { id: 4, nombre: 'El Cacahuatazo', categoria: 'tv', piezas: 180, precio: 550, stock: 25, rating: 5, imagen: '/sets/cacahuatazo.png' },
]

// Textos del banner principal. Se editan aquí.
export const HERO_DESTACADO = {
  setId: 1,
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
