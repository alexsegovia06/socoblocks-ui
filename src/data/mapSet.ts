import type { CategoriaId, SetColeccionable } from './sets.ts'

export interface SetApi {
  id: number
  name: string
  description: string
  price: number
  pieceCount: number
  imageUrl: string
  category: string
  stock: number
  active: boolean
}

const CATEGORIAS_API: Record<string, CategoriaId> = {
  TV_NACIONAL: 'tv',
  CLASICO_INTERNET: 'clasicos',
  ENTREVISTAS: 'entrevistas'
}

export function toSet(s: SetApi): SetColeccionable {
  return {
    id: s.id,
    nombre: s.name,
    descripcion: s.description,
    precio: s.price,
    piezas: s.pieceCount,
    imagen: s.imageUrl,
    categoria: CATEGORIAS_API[s.category] ?? 'clasicos',
    stock: s.stock,
    rating: 0,
    resenas: 0,
    visual: ['🧱', '🧱'],
  }
}
