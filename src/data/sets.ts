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

// TODO: reemplazar por la petición al backend cuando exista el endpoint de sets.
export const SETS: SetColeccionable[] = [
  {
    id: 1, nombre: 'La caída de Edgar', categoria: 'clasicos', piezas: 350, precio: 899, stock: 15, rating: 5, resenas: 48,
    descripcion: 'Reconstruye el puente rústico sobre el río de San Carlos, el momento exacto donde Edgar suplica clemencia y el fatídico chapuzón con piezas de agua translúcida.',
    visual: ['🪵', '🌊'], imagen: '/sets/edgar.png',
  },
  {
    id: 2, nombre: 'Se Vale: La Tirolesa', categoria: 'tv', piezas: 420, precio: 1099, stock: 3, rating: 5, resenas: 32,
    descripcion: 'Arma la tirolesa del programa de concursos más querido de la TV, con la carpa, el cable tenso y el participante a medio camino.',
    visual: ['📺', '🎪'], imagen: '/sets/se-vale.png',
  },
  {
    id: 3, nombre: 'El Ferras', categoria: 'entrevistas', piezas: 200, precio: 649, stock: 0, rating: 5, resenas: 27,
    descripcion: 'Recrea el set de la entrevista legendaria: el micrófono, la balanza de la justicia y la mirada que se volvió meme.',
    visual: ['🎙️', '⚖️'], imagen: '/sets/ferras.png',
  },
  {
    id: 4, nombre: 'El Cacahuatazo', categoria: 'tv', piezas: 180, precio: 550, stock: 25, rating: 5, resenas: 19,
    descripcion: 'El escenario del cacahuatazo con cámara, claqueta y el proyectil más famoso de la televisión nacional.',
    visual: ['🥜', '🎬'], imagen: '/sets/cacahuatazo.png',
  },
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
