import { useEffect, useMemo, useState } from 'react'
import { Info, Search, Users } from 'lucide-react'
import { useAuth } from '../../../auth/AuthContext.tsx'
import { formatoPrecio } from '../../../data/sets.ts'
import { formatoFecha, leerTodosLosPedidos } from '../../../pedidos/pedidos.ts'
import { useToast } from '../../../toast/ToastContext.tsx'
import type { Role } from '../../../types.ts'
import { leerUsuariosConocidos } from '../../../usuarios/registro.ts'
import '../admin.css'

interface UsuarioFila {
  username: string
  role: Role
  ultimoAcceso?: string
}

const ROLES: { id: Role; label: string }[] = [
  { id: 'COLECCIONISTA', label: 'Coleccionista' },
  { id: 'VENDEDOR', label: 'Vendedor' },
  { id: 'ADMIN', label: 'Administrador' },
]

type Filtro = 'todos' | Role

export default function AdminUsers() {
  const { user, authFetch } = useAuth()
  const toast = useToast()
  const [usuarios, setUsuarios] = useState<UsuarioFila[] | null>(null)
  // 'api' = vienen del backend; 'local' = respaldo con los usuarios que entraron en este navegador
  const [fuente, setFuente] = useState<'api' | 'local'>('api')
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    let vigente = true
    authFetch<UsuarioFila[]>('/api/admin/users')
      .then((data) => {
        if (!vigente) return
        setUsuarios(data)
        setFuente('api')
      })
      .catch(() => {
        // El endpoint todavía no existe: se muestran los usuarios conocidos en este navegador
        if (!vigente) return
        setUsuarios(leerUsuariosConocidos())
        setFuente('local')
      })
    return () => {
      vigente = false
    }
    // authFetch cambia en cada render del AuthProvider; solo se pide al abrir la página
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Compras de cada usuario (de los pedidos guardados)
  const compras = useMemo(() => {
    const porCliente: Record<string, { pedidos: number; total: number }> = {}
    for (const p of leerTodosLosPedidos()) {
      const c = (porCliente[p.cliente] ??= { pedidos: 0, total: 0 })
      c.pedidos += 1
      c.total += p.total
    }
    return porCliente
  }, [])

  const lista = usuarios ?? []
  const texto = busqueda.trim().toLowerCase()
  const visibles = lista.filter(
    (u) => (filtro === 'todos' || u.role === filtro) && (!texto || u.username.toLowerCase().includes(texto)),
  )
  const cuenta = (f: Filtro) => (f === 'todos' ? lista.length : lista.filter((u) => u.role === f).length)

  async function cambiarRol(u: UsuarioFila, role: Role) {
    try {
      // TODO: confirmar ruta y cuerpo con el backend
      await authFetch(`/api/admin/users/${encodeURIComponent(u.username)}/role`, { method: 'PUT', body: { role } })
      setUsuarios((prev) => prev?.map((x) => (x.username === u.username ? { ...x, role } : x)) ?? prev)
      toast.exito(`${u.username} ahora es ${ROLES.find((r) => r.id === role)?.label.toLowerCase()}.`)
    } catch (err) {
      // El rol real vive en el backend (va dentro del token): si no se guardó allá, no se cambia aquí
      toast.error(`No se pudo cambiar el rol de ${u.username}: ${(err as Error).message}`)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Usuarios</h1>
        <p>Consulta quién usa la tienda y administra el rol de cada cuenta</p>
      </header>

      {fuente === 'local' && usuarios && (
        <p className="admin-page__aviso" role="status">
          <Info size={16} />
          El backend todavía no tiene la lista de usuarios (/api/admin/users). Se muestran las cuentas que han
          iniciado sesión en este navegador; el cambio de rol se intentará guardar en el backend.
        </p>
      )}

      <div className="admin-page__barra">
        <div className="admin-page__pestanas" role="group" aria-label="Filtrar por rol">
          {[{ id: 'todos' as const, label: 'Todos' }, ...ROLES].map((r) => (
            <button
              key={r.id}
              type="button"
              className="admin-page__pestana"
              aria-pressed={filtro === r.id}
              onClick={() => setFiltro(r.id)}
            >
              {r.label}
              <span>{cuenta(r.id)}</span>
            </button>
          ))}
        </div>

        <label className="admin-page__buscar">
          <Search size={16} />
          <input
            type="search"
            placeholder="Buscar usuario…"
            aria-label="Buscar usuario"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>
      </div>

      <div className="admin-page__card">
        {usuarios === null ? (
          <p className="admin-page__vacio">Cargando usuarios…</p>
        ) : visibles.length === 0 ? (
          <div className="admin-page__vacio">
            <Users size={32} />
            <strong>{lista.length === 0 ? 'Aún no hay usuarios' : 'Ningún usuario coincide'}</strong>
          </div>
        ) : (
          <table className="admin-page__tabla">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Último acceso</th>
                <th>Pedidos</th>
                <th>Total comprado</th>
                <th className="admin-page__derecha">Rol</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((u) => {
                const esYo = u.username === user?.username
                const c = compras[u.username]
                return (
                  <tr key={u.username}>
                    <td>
                      <div className="admin-page__usuario">
                        <span className="admin-page__avatar" aria-hidden="true">
                          {u.username.charAt(0).toUpperCase()}
                        </span>
                        <strong>
                          {u.username}
                          {esYo && <span className="admin-page__tenue"> (tú)</span>}
                        </strong>
                      </div>
                    </td>
                    <td className="admin-page__tenue">{u.ultimoAcceso ? formatoFecha(u.ultimoAcceso) : '—'}</td>
                    <td>{c?.pedidos ?? 0}</td>
                    <td>{c ? `${formatoPrecio(c.total)} MXN` : '—'}</td>
                    <td className="admin-page__derecha">
                      <select
                        className="admin-page__select"
                        aria-label={`Rol de ${u.username}`}
                        value={u.role}
                        // Quitarte tu propio rol de admin te dejaría fuera del panel
                        disabled={esYo}
                        title={esYo ? 'No puedes cambiar tu propio rol' : undefined}
                        onChange={(e) => cambiarRol(u, e.target.value as Role)}
                      >
                        {ROLES.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.label}
                          </option>
                        ))}
                      </select>
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
