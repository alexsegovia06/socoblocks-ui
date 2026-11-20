// Pedidos confirmados en el checkout, guardados en el navegador por usuario.
// TODO: reemplazar por POST /api/pedidos (y GET para listarlos) cuando exista el endpoint.

export type MetodoPago = 'tarjeta' | 'transferencia' | 'oxxo'

export interface DatosEnvio {
  nombre: string
  telefono: string
  calle: string
  colonia: string
  ciudad: string
  estado: string
  cp: string
}

export interface LineaPedido {
  setId: number
  nombre: string
  precio: number
  cantidad: number
  imagen?: string
}

export interface Pedido {
  folio: string
  fecha: string // ISO
  lineas: LineaPedido[]
  total: number
  envio: DatosEnvio
  metodoPago: MetodoPago
  estado: 'PENDIENTE' | 'ENVIADO' | 'ENTREGADO'
}

// Cómo se muestra cada estado en pantalla
export const ESTADO_PEDIDO: Record<Pedido['estado'], string> = {
  PENDIENTE: 'Preparando',
  ENVIADO: 'En camino',
  ENTREGADO: 'Entregado',
}

export const METODO_PAGO: Record<MetodoPago, string> = {
  tarjeta: 'Tarjeta al recibir',
  transferencia: 'Transferencia',
  oxxo: 'Pago en OXXO',
}

export const formatoFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })

const clave = (username: string) => `pedidos:${username}`

export function leerPedidos(username: string): Pedido[] {
  try {
    const datos: unknown = JSON.parse(localStorage.getItem(clave(username)) ?? '[]')
    return Array.isArray(datos) ? (datos as Pedido[]) : []
  } catch {
    return []
  }
}

// Pedido junto con el usuario que lo hizo (para el vendedor y el admin)
export interface PedidoDeCliente extends Pedido {
  cliente: string
}

// Todos los pedidos guardados en este navegador, de todos los usuarios, del más reciente al más viejo.
// TODO: reemplazar por GET /api/pedidos (vendedor/admin) cuando exista el endpoint.
export function leerTodosLosPedidos(): PedidoDeCliente[] {
  const todos: PedidoDeCliente[] = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (!k?.startsWith('pedidos:')) continue
      const cliente = k.slice('pedidos:'.length)
      for (const p of leerPedidos(cliente)) todos.push({ ...p, cliente })
    }
  } catch {
    return []
  }
  return todos.sort((a, b) => b.fecha.localeCompare(a.fecha))
}

// TODO: reemplazar por PATCH /api/pedidos/{folio} cuando exista el endpoint.
export function cambiarEstadoPedido(cliente: string, folio: string, estado: Pedido['estado']) {
  const pedidos = leerPedidos(cliente).map((p) => (p.folio === folio ? { ...p, estado } : p))
  try {
    localStorage.setItem(clave(cliente), JSON.stringify(pedidos))
  } catch {
    // Sin almacenamiento el cambio no se conserva
  }
}

// Folio corto y legible, p. ej. SB-7K3F9Q
function nuevoFolio() {
  return `SB-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`
}

export function crearPedido(
  username: string,
  datos: Omit<Pedido, 'folio' | 'fecha' | 'estado'>,
): Pedido {
  const pedido: Pedido = { ...datos, folio: nuevoFolio(), fecha: new Date().toISOString(), estado: 'PENDIENTE' }
  try {
    localStorage.setItem(clave(username), JSON.stringify([pedido, ...leerPedidos(username)]))
  } catch {
    // Si no se puede guardar, el pedido igual se confirma en pantalla
  }
  return pedido
}
