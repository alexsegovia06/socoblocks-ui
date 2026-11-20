import { Link, useSearchParams } from 'react-router'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useCatalogo } from '../../../catalogo/useCatalogo.ts'
import { useEstadoSets } from '../../../catalogo/useEstadoSets.ts'
import { CATEGORIAS, formatoPrecio, type CategoriaId, type SetColeccionable } from '../../../data/sets.ts'
import { useToast } from '../../../toast/ToastContext.tsx'
import './SellerProducts.css'

// TODO: cuando exista el endpoint de "mis productos", listar solo los sets de este vendedor.
// Por ahora se muestran todos los del catálogo.

type FiltroStock = 'todos' | 'bajo' | 'agotado'
type FiltroEstado = 'todos' | 'activos' | 'inactivos'

const etiquetaCategoria = (id: CategoriaId) => CATEGORIAS.find((c) => c.id === id)?.etiqueta ?? id

export default function SellerProducts() {
  const { sets, cargando, error, recargar } = useCatalogo()
  const { estaActivo, cambiarActivo } = useEstadoSets()
  const toast = useToast()

  // Los filtros viven en la URL: se pueden compartir y la alerta de stock del dashboard llega con ?stock=bajo
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const categoria = (params.get('categoria') ?? 'todas') as CategoriaId | 'todas'
  const stock = (params.get('stock') ?? 'todos') as FiltroStock
  const estado = (params.get('estado') ?? 'todos') as FiltroEstado

  function cambiarFiltro(nombre: string, valor: string, porDefecto: string) {
    setParams(
      (prev) => {
        const siguiente = new URLSearchParams(prev)
        if (valor === porDefecto) siguiente.delete(nombre)
        else siguiente.set(nombre, valor)
        return siguiente
      },
      { replace: true },
    )
  }

  const texto = q.trim().toLowerCase()
  const visibles = sets.filter(
    (s) =>
      (!texto || s.nombre.toLowerCase().includes(texto)) &&
      (categoria === 'todas' || s.categoria === categoria) &&
      (stock === 'todos' || (stock === 'agotado' ? s.stock === 0 : s.stock > 0 && s.stock <= 5)) &&
      (estado === 'todos' || (estado === 'activos') === estaActivo(s)),
  )
  const hayFiltros = params.toString() !== ''

  function alternar(set: SetColeccionable) {
    const activo = !estaActivo(set)
    cambiarActivo(set.id, activo)
    toast.info(activo ? `${set.nombre} ya está publicado en la tienda.` : `${set.nombre} se ocultó del catálogo.`, {
      accion: { texto: 'Deshacer', onClick: () => cambiarActivo(set.id, !activo) },
    })
  }

  return (
    <div className="seller-products">
      <header className="seller-products__header">
        <div>
          <h1>Gestión de Catálogo</h1>
          <p>Administra los sets que tienes publicados en la tienda</p>
        </div>

        {/* Alta y edición de sets todavía no tienen endpoint */}
        <button type="button" className="seller-products__new" disabled title="Próximamente">
          <Plus size={20} />
          Nuevo Set
        </button>
      </header>

      <div className="seller-products__filtros" role="search">
        <label className="seller-products__buscar">
          <Search size={16} />
          <input
            type="search"
            placeholder="Buscar por nombre…"
            aria-label="Buscar sets por nombre"
            value={q}
            onChange={(e) => cambiarFiltro('q', e.target.value, '')}
          />
        </label>

        <select
          aria-label="Categoría"
          value={categoria}
          onChange={(e) => cambiarFiltro('categoria', e.target.value, 'todas')}
        >
          <option value="todas">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <select aria-label="Stock" value={stock} onChange={(e) => cambiarFiltro('stock', e.target.value, 'todos')}>
          <option value="todos">Todo el stock</option>
          <option value="bajo">Stock bajo (1–5)</option>
          <option value="agotado">Agotados</option>
        </select>

        <select aria-label="Estatus" value={estado} onChange={(e) => cambiarFiltro('estado', e.target.value, 'todos')}>
          <option value="todos">Activos e inactivos</option>
          <option value="activos">Solo activos</option>
          <option value="inactivos">Solo inactivos</option>
        </select>

        {hayFiltros && (
          <button type="button" className="seller-products__limpiar" onClick={() => setParams({}, { replace: true })}>
            Limpiar
          </button>
        )}
      </div>

      <div className="seller-products__card">
        {cargando ? (
          <p className="seller-products__estado">Cargando tus sets…</p>
        ) : error && sets.length === 0 ? (
          <div className="seller-products__estado">
            <p className="error">{error}</p>
            <button type="button" onClick={recargar}>
              Reintentar
            </button>
          </div>
        ) : visibles.length === 0 ? (
          <p className="seller-products__estado">
            {sets.length === 0 ? 'Todavía no tienes sets publicados.' : 'Ningún set coincide con los filtros.'}
          </p>
        ) : (
          <table className="seller-products__table">
            <caption className="seller-products__caption">
              Mostrando {visibles.length} de {sets.length} sets
            </caption>
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
              {visibles.map((p) => {
                const activo = estaActivo(p)
                return (
                  <tr key={p.id} className={activo ? undefined : 'seller-products__fila--inactiva'}>
                    <td>
                      <span className="seller-products__visual" aria-hidden="true">
                        {p.imagen ? <img src={p.imagen} alt="" loading="lazy" /> : <span>{p.visual[0]}</span>}
                      </span>
                    </td>
                    <td className="seller-products__name">
                      <Link to={`/products/${p.id}`}>{p.nombre}</Link>
                    </td>
                    <td className="seller-products__category">{etiquetaCategoria(p.categoria)}</td>
                    <td className="seller-products__price">{formatoPrecio(p.precio)} MXN</td>
                    <td>
                      <span
                        className={`seller-products__stock${p.stock <= 5 ? ' seller-products__stock--low' : ''}`}
                      >
                        {p.stock === 0 ? 'Agotado' : `${p.stock} unidades`}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={activo}
                        aria-label={`Publicar ${p.nombre}`}
                        className={`seller-products__switch${activo ? ' seller-products__switch--on' : ''}`}
                        onClick={() => alternar(p)}
                      >
                        <span className="seller-products__switch-pista" aria-hidden="true">
                          <span className="seller-products__switch-bola" />
                        </span>
                        {activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="seller-products__actions-col">
                      {/* Editar y eliminar todavía no tienen endpoint */}
                      <div className="seller-products__actions">
                        <button type="button" aria-label={`Editar ${p.nombre}`} title="Próximamente" disabled>
                          <Pencil size={20} />
                        </button>
                        <button type="button" aria-label={`Eliminar ${p.nombre}`} title="Próximamente" disabled>
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
