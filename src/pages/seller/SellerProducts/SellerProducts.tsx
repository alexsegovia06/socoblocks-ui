import { Pencil, Plus, Trash2 } from 'lucide-react'
import { CATEGORIAS, formatoPrecio, type CategoriaId } from '../../../data/sets.ts'
import './SellerProducts.css'

interface ProductoVendedor {
  id: number
  nombre: string
  categoria: CategoriaId
  precio: number
  stock: number
  visual: [string, string]
  activo: boolean
}

// TODO: reemplazar por la petición al backend cuando exista el endpoint de productos del vendedor.
const PRODUCTOS: ProductoVendedor[] = [
  { id: 1, nombre: 'La caída de Edgar', categoria: 'clasicos', precio: 899, stock: 15, visual: ['🪵', '🌊'], activo: true },
  { id: 2, nombre: 'Se Vale: La Tirolesa', categoria: 'tv', precio: 1150, stock: 3, visual: ['📺', '🎪'], activo: true },
  { id: 3, nombre: 'El Ferras', categoria: 'entrevistas', precio: 650, stock: 0, visual: ['🎙️', '⚖️'], activo: true },
  { id: 4, nombre: 'El Cacahuatazo', categoria: 'tv', precio: 550, stock: 25, visual: ['🥜', '🎬'], activo: true },
]

const etiquetaCategoria = (id: CategoriaId) => CATEGORIAS.find((c) => c.id === id)?.etiqueta ?? id

export default function SellerProducts() {
  return (
    <div className="seller-products">
      <header className="seller-products__header">
        <div>
          <h1>Gestión de Catálogo</h1>
          <p>Administra los sets que tienes publicados en la tienda</p>
        </div>

        <button type="button" className="seller-products__new">
          <Plus size={20} />
          Nuevo Set
        </button>
      </header>

      <div className="seller-products__card">
        <table className="seller-products__table">
          <thead>
            <tr>
              <th>Visual</th>
              <th>Nombre del set</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estatus</th>
              <th className="seller-products__actions-col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTOS.map((p) => (
              <tr key={p.id}>
                <td>
                  <span className="seller-products__visual" aria-hidden="true">
                    <span>{p.visual[0]}</span>
                    <span>{p.visual[1]}</span>
                  </span>
                </td>
                <td className="seller-products__name">{p.nombre}</td>
                <td className="seller-products__category">{etiquetaCategoria(p.categoria)}</td>
                <td className="seller-products__price">{formatoPrecio(p.precio)} MXN</td>
                <td>
                  <span className={`seller-products__stock${p.stock <= 5 ? ' seller-products__stock--low' : ''}`}>
                    {p.stock} unidades
                  </span>
                </td>
                <td>
                  <span className="seller-products__status">{p.activo ? 'Activo' : 'Inactivo'}</span>
                </td>
                <td className="seller-products__actions-col">
                  <div className="seller-products__actions">
                    <button type="button" aria-label={`Editar ${p.nombre}`}>
                      <Pencil size={20} />
                    </button>
                    <button type="button" aria-label={`Eliminar ${p.nombre}`}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
