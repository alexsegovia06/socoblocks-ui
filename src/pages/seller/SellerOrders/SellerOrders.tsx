import { useState } from 'react'
import { MapPin, Search, Truck, Wallet } from 'lucide-react'
import OrderStatus from '../../../components/OrderStatus/OrderStatus.tsx'
import { formatoPrecio } from '../../../data/sets.ts'
import {
  ESTADO_PEDIDO,
  METODO_PAGO,
  cambiarEstadoPedido,
  formatoFecha,
  leerTodosLosPedidos,
  type Pedido,
  type PedidoDeCliente,
} from '../../../pedidos/pedidos.ts'
import { useToast } from '../../../toast/ToastContext.tsx'
import './SellerOrders.css'

type Pestana = 'todos' | Pedido['estado']

const PESTANAS: { id: Pestana; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'PENDIENTE', label: 'Por despachar' },
  { id: 'ENVIADO', label: 'En camino' },
  { id: 'ENTREGADO', label: 'Entregados' },
]

const ESTADOS = Object.keys(ESTADO_PEDIDO) as Pedido['estado'][]

export default function SellerOrders() {
  // TODO: cuando exista GET /api/pedidos, pedir aquí solo los pedidos de los sets de este vendedor
  const [pedidos, setPedidos] = useState<PedidoDeCliente[]>(leerTodosLosPedidos)
  const [pestana, setPestana] = useState<Pestana>('todos')
  const [busqueda, setBusqueda] = useState('')
  const toast = useToast()

  const texto = busqueda.trim().toLowerCase()
  const visibles = pedidos.filter(
    (p) =>
      (pestana === 'todos' || p.estado === pestana) &&
      (!texto || p.folio.toLowerCase().includes(texto) || p.cliente.toLowerCase().includes(texto)),
  )
  const cuenta = (id: Pestana) => (id === 'todos' ? pedidos.length : pedidos.filter((p) => p.estado === id).length)

  function cambiarEstado(p: PedidoDeCliente, estado: Pedido['estado']) {
    const anterior = p.estado
    cambiarEstadoPedido(p.cliente, p.folio, estado)
    setPedidos(leerTodosLosPedidos())
    toast.exito(`Pedido ${p.folio}: ${ESTADO_PEDIDO[estado].toLowerCase()}.`, {
      accion: {
        texto: 'Deshacer',
        onClick: () => {
          cambiarEstadoPedido(p.cliente, p.folio, anterior)
          setPedidos(leerTodosLosPedidos())
        },
      },
    })
  }

  return (
    <div className="seller-orders">
      <header className="seller-orders__header">
        <h1>Órdenes Recibidas</h1>
        <p>Consulta los pedidos de tus clientes y actualiza en qué va cada envío</p>
      </header>

      <div className="seller-orders__barra">
        <div className="seller-orders__pestanas" role="group" aria-label="Filtrar por estado">
          {PESTANAS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={pestana === t.id}
              className={`seller-orders__pestana${pestana === t.id ? ' seller-orders__pestana--activa' : ''}`}
              onClick={() => setPestana(t.id)}
            >
              {t.label}
              <span>{cuenta(t.id)}</span>
            </button>
          ))}
        </div>

        <label className="seller-orders__buscar">
          <Search size={16} />
          <input
            type="search"
            placeholder="Folio o cliente…"
            aria-label="Buscar por folio o cliente"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>
      </div>

      {visibles.length === 0 ? (
        <section className="seller-orders__vacio">
          <Truck size={36} />
          <strong>{pedidos.length === 0 ? 'Aún no hay pedidos' : 'Ningún pedido coincide'}</strong>
          <p>
            {pedidos.length === 0
              ? 'Cuando un coleccionista compre uno de tus sets, aparecerá aquí.'
              : 'Prueba con otra pestaña o búsqueda.'}
          </p>
        </section>
      ) : (
        <ul className="seller-orders__lista">
          {visibles.map((p) => {
            const unidades = p.lineas.reduce((suma, l) => suma + l.cantidad, 0)
            return (
              <li key={`${p.cliente}-${p.folio}`} className="seller-orders__pedido">
                <div className="seller-orders__fila">
                  <div className="seller-orders__id">
                    <strong>{p.folio}</strong>
                    <small>
                      {formatoFecha(p.fecha)} · {p.cliente}
                    </small>
                  </div>
                  <span className="seller-orders__unidades">
                    {unidades} {unidades === 1 ? 'producto' : 'productos'}
                  </span>
                  <strong className="seller-orders__total">{formatoPrecio(p.total)} MXN</strong>
                  <OrderStatus estado={p.estado} />
                  <select
                    className="seller-orders__select"
                    aria-label={`Cambiar estado del pedido ${p.folio}`}
                    value={p.estado}
                    onChange={(e) => cambiarEstado(p, e.target.value as Pedido['estado'])}
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>
                        {ESTADO_PEDIDO[e]}
                      </option>
                    ))}
                  </select>
                </div>

                <details className="seller-orders__detalle">
                  <summary>Ver detalle</summary>
                  <ul className="seller-orders__lineas">
                    {p.lineas.map((l) => (
                      <li key={l.setId}>
                        <span>{l.nombre}</span>
                        <span>× {l.cantidad}</span>
                        <strong>{formatoPrecio(l.precio * l.cantidad)}</strong>
                      </li>
                    ))}
                  </ul>
                  <p>
                    <MapPin size={14} /> {p.envio.nombre} · {p.envio.telefono} · {p.envio.calle}, {p.envio.colonia},{' '}
                    {p.envio.ciudad}, {p.envio.estado} C.P. {p.envio.cp}
                  </p>
                  <p>
                    <Wallet size={14} /> {METODO_PAGO[p.metodoPago]}
                  </p>
                </details>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
