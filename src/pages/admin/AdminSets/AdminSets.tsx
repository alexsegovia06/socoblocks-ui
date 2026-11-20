import { useState } from 'react'
import { Link } from 'react-router'
import { CheckCircle2, EyeOff, PackageSearch, Search } from 'lucide-react'
import { useCatalogo } from '../../../catalogo/useCatalogo.ts'
import { useEstadoSets } from '../../../catalogo/useEstadoSets.ts'
import { CATEGORIAS, formatoPrecio, type SetColeccionable } from '../../../data/sets.ts'
import { useToast } from '../../../toast/ToastContext.tsx'
import '../admin.css'

// Aprobación de sets: un set inactivo está "pendiente" y no se ve en la tienda hasta que el admin lo aprueba.
// Usa el mismo estado activo/inactivo que el switch del vendedor.

type Filtro = 'pendientes' | 'publicados' | 'todos'

export default function AdminSets() {
  const { sets, cargando, error, recargar } = useCatalogo()
  const { estaActivo, cambiarActivo } = useEstadoSets()
  const toast = useToast()
  const [filtro, setFiltro] = useState<Filtro>('pendientes')
  const [busqueda, setBusqueda] = useState('')

  const pendientes = sets.filter((s) => !estaActivo(s))
  const texto = busqueda.trim().toLowerCase()
  const visibles = sets.filter(
    (s) =>
      (filtro === 'todos' || (filtro === 'publicados') === estaActivo(s)) &&
      (!texto || s.nombre.toLowerCase().includes(texto)),
  )

  function cambiar(set: SetColeccionable, activo: boolean) {
    cambiarActivo(set.id, activo)
    const deshacer = { texto: 'Deshacer', onClick: () => cambiarActivo(set.id, !activo) }
    if (activo) toast.exito(`${set.nombre} se aprobó y ya está en la tienda.`, { accion: deshacer })
    else toast.info(`${set.nombre} se retiró de la tienda.`, { accion: deshacer })
  }

  const FILTROS: { id: Filtro; label: string; cuenta: number }[] = [
    { id: 'pendientes', label: 'Pendientes', cuenta: pendientes.length },
    { id: 'publicados', label: 'Publicados', cuenta: sets.length - pendientes.length },
    { id: 'todos', label: 'Todos', cuenta: sets.length },
  ]

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Aprobación de sets</h1>
        <p>Revisa los sets antes de que aparezcan en la tienda, o retira los que no cumplan</p>
      </header>

      <div className="admin-page__barra">
        <div className="admin-page__pestanas" role="group" aria-label="Filtrar sets">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              className="admin-page__pestana"
              aria-pressed={filtro === f.id}
              onClick={() => setFiltro(f.id)}
            >
              {f.label}
              <span>{f.cuenta}</span>
            </button>
          ))}
        </div>

        <label className="admin-page__buscar">
          <Search size={16} />
          <input
            type="search"
            placeholder="Buscar set…"
            aria-label="Buscar set"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>
      </div>

      <div className="admin-page__card">
        {cargando ? (
          <p className="admin-page__vacio">Cargando sets…</p>
        ) : error && sets.length === 0 ? (
          <div className="admin-page__vacio">
            <p className="error">{error}</p>
            <button type="button" onClick={recargar}>
              Reintentar
            </button>
          </div>
        ) : visibles.length === 0 ? (
          <div className="admin-page__vacio">
            <PackageSearch size={32} />
            <strong>{filtro === 'pendientes' && !texto ? 'No hay sets por aprobar' : 'Ningún set coincide'}</strong>
            {filtro === 'pendientes' && !texto && <p>Todo el catálogo está revisado y publicado.</p>}
          </div>
        ) : (
          <table className="admin-page__tabla">
            <thead>
              <tr>
                <th>Set</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th className="admin-page__derecha">Acción</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((s) => {
                const activo = estaActivo(s)
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="admin-page__usuario">
                        <span className="admin-page__miniatura" aria-hidden="true">
                          {s.imagen ? <img src={s.imagen} alt="" loading="lazy" /> : s.visual[0]}
                        </span>
                        <span>
                          <Link to={`/products/${s.id}`}>{s.nombre}</Link>
                          <br />
                          <span className="admin-page__tenue">{s.piezas} piezas</span>
                        </span>
                      </div>
                    </td>
                    <td className="admin-page__tenue">{CATEGORIAS.find((c) => c.id === s.categoria)?.etiqueta}</td>
                    <td>{formatoPrecio(s.precio)} MXN</td>
                    <td>{s.stock === 0 ? 'Agotado' : s.stock}</td>
                    <td>
                      <span className={`admin-page__etiqueta admin-page__etiqueta--${activo ? 'ok' : 'pendiente'}`}>
                        {activo ? 'Publicado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="admin-page__derecha">
                      {activo ? (
                        <button
                          type="button"
                          className="admin-page__boton admin-page__boton--suave"
                          onClick={() => cambiar(s, false)}
                        >
                          <EyeOff size={15} />
                          Retirar
                        </button>
                      ) : (
                        <button type="button" className="admin-page__boton" onClick={() => cambiar(s, true)}>
                          <CheckCircle2 size={15} />
                          Aprobar y publicar
                        </button>
                      )}
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
