import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, BellRing, Blocks, Heart, Package, Puzzle, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../../auth/AuthContext.tsx'
import { useCatalogo } from '../../../catalogo/useCatalogo.ts'
import { useAgregarAlCarrito } from '../../../carrito/useAgregarAlCarrito.ts'
import { useColection } from '../../../colection/useColection.ts'
import OrderStatus from '../../../components/OrderStatus/OrderStatus.tsx'
import ProfileSection, { FilaSet } from '../../../components/ProfileSection/ProfileSection.tsx'
import StockTag from '../../../components/StockTag/StockTag.tsx'
import { formatoPrecio } from '../../../data/sets.ts'
import type { SetColeccionable } from '../../../data/sets.ts'
import { formatoFecha, leerPedidos } from '../../../pedidos/pedidos.ts'
import { useWishlist } from '../../../wishlist/useWishlist.ts'
import { guardarStockVisto, leerStockVisto } from '../../../wishlist/stockVisto.ts'
import './UserHome.css'

type Novedad = 'volvio' | 'ultimas' | 'disponible'

const PRIORIDAD: Record<Novedad, number> = { volvio: 0, ultimas: 1, disponible: 2 }

export default function UserHome() {
  const { user } = useAuth()
  const username = user?.username ?? ''
  const catalogo = useCatalogo()
  const wishlist = useWishlist()
  const coleccion = useColection()
  const agregarAlCarrito = useAgregarAlCarrito()
  const pedidos = useMemo(() => (username ? leerPedidos(username) : []), [username])

  // Stock que se vio la última vez que entró aquí (se lee una sola vez, al abrir la página)
  const [stockVisto] = useState(() => (username ? leerStockVisto(username) : {}))

  const enWishlist = wishlist.ids
    .map((id) => catalogo.sets.find((s) => s.id === id))
    .filter((s): s is SetColeccionable => s !== undefined)
  const enColeccion = coleccion.ids
    .map((id) => catalogo.sets.find((s) => s.id === id))
    .filter((s): s is SetColeccionable => s !== undefined)

  // Sets de la wishlist que se pueden comprar ya, con los que acaban de regresar primero
  const novedades = enWishlist
    .filter((s) => s.stock > 0)
    .map((set) => ({
      set,
      tipo: (stockVisto[set.id] === 0 ? 'volvio' : set.stock <= 5 ? 'ultimas' : 'disponible') as Novedad,
    }))
    .sort((a, b) => PRIORIDAD[a.tipo] - PRIORIDAD[b.tipo])
    .slice(0, 4)
  const agotados = enWishlist.filter((s) => s.stock === 0).length

  // Al terminar de cargar, se guarda el stock actual para comparar en la próxima visita
  useEffect(() => {
    if (!username || catalogo.cargando || catalogo.sets.length === 0) return
    const foto: Record<number, number> = {}
    for (const id of wishlist.ids) {
      const set = catalogo.sets.find((s) => s.id === id)
      if (set) foto[id] = set.stock
    }
    guardarStockVisto(username, foto)
  }, [username, catalogo.cargando, catalogo.sets, wishlist.ids])

  const total = catalogo.sets.length
  const porcentaje = total === 0 ? 0 : Math.round((enColeccion.length / total) * 100)
  const piezas = enColeccion.reduce((suma, s) => suma + s.piezas, 0)

  return (
    <>
      <header className="user-home__head">
        <h1>¡Hola, {username}!</h1>
        <p className="muted">Esto es lo que pasa con tu colección.</p>
      </header>

      <section className="user-home__stats" aria-label="Resumen">
        <Dato icono={<Blocks size={20} />} valor={enColeccion.length} etiqueta="En tu colección" pie={`${porcentaje}% del catálogo`} />
        <Dato icono={<Heart size={20} />} valor={enWishlist.length} etiqueta="En tu wishlist" pie={agotados > 0 ? `${agotados} agotados` : 'Todos disponibles'} />
        <Dato icono={<Package size={20} />} valor={pedidos.length} etiqueta="Pedidos" pie={pedidos[0] ? `Último: ${formatoFecha(pedidos[0].fecha)}` : 'Aún sin compras'} />
        <Dato icono={<Puzzle size={20} />} valor={piezas.toLocaleString('es-MX')} etiqueta="Piezas armadas" pie="Sumando tu colección" />
      </section>

      <ProfileSection
        id="novedades-titulo"
        titulo="Novedades de tu wishlist"
        icono={<BellRing size={18} />}
        contador={`${novedades.length} disponibles`}
      >
        {catalogo.cargando ? (
          <p className="muted">Revisando el stock…</p>
        ) : novedades.length === 0 ? (
          <div className="seccion-perfil__vacio">
            <p>
              {enWishlist.length === 0
                ? 'Aún no tienes sets en tu wishlist.'
                : 'Los sets de tu wishlist están agotados por ahora. Te avisamos aquí cuando regresen.'}
            </p>
            <Link to="/" className="seccion-perfil__explorar">
              Explorar el catálogo
            </Link>
          </div>
        ) : (
          <ul className="seccion-perfil__lista">
            {novedades.map(({ set, tipo }) => (
              <FilaSet key={set.id} set={set}>
                {tipo === 'volvio' ? (
                  <span className="user-home__volvio">¡Volvió a haber stock!</span>
                ) : (
                  <StockTag stock={set.stock} />
                )}
                <button
                  type="button"
                  className="user-home__agregar"
                  aria-label={`Agregar ${set.nombre} al carrito`}
                  onClick={() => agregarAlCarrito(set)}
                >
                  <ShoppingBag size={15} />
                  Agregar
                </button>
              </FilaSet>
            ))}
          </ul>
        )}
      </ProfileSection>

      <ProfileSection
        id="ultimos-pedidos-titulo"
        titulo="Últimos pedidos"
        icono={<Package size={18} />}
        contador={`${pedidos.length} en total`}
      >
        {pedidos.length === 0 ? (
          <div className="seccion-perfil__vacio">
            <p>Cuando compres un set, aquí verás en qué va tu envío.</p>
          </div>
        ) : (
          <>
            <ul className="user-home__pedidos">
              {pedidos.slice(0, 3).map((p) => (
                <li key={p.folio}>
                  <div>
                    <strong>{p.folio}</strong>
                    <small>
                      {formatoFecha(p.fecha)} · {p.lineas.length} {p.lineas.length === 1 ? 'set' : 'sets'}
                    </small>
                  </div>
                  <strong>{formatoPrecio(p.total)}</strong>
                  <OrderStatus estado={p.estado} />
                </li>
              ))}
            </ul>
            <Link to="/user/orders" className="user-home__ver">
              Ver todos mis pedidos
              <ArrowRight size={15} />
            </Link>
          </>
        )}
      </ProfileSection>
    </>
  )
}

function Dato({ icono, valor, etiqueta, pie }: { icono: ReactNode; valor: ReactNode; etiqueta: string; pie: string }) {
  return (
    <article className="user-home__dato">
      <span className="user-home__icono">{icono}</span>
      <strong>{valor}</strong>
      <span className="user-home__etiqueta">{etiqueta}</span>
      <small>{pie}</small>
    </article>
  )
}
