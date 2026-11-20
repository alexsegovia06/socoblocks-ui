import { ESTADO_PEDIDO } from '../../pedidos/pedidos.ts'
import type { Pedido } from '../../pedidos/pedidos.ts'
import './OrderStatus.css'

// Etiqueta de color con el estado de un pedido. La usan el coleccionista, el vendedor y el admin.
export default function OrderStatus({ estado }: { estado: Pedido['estado'] }) {
  return <span className={`order-status order-status--${estado.toLowerCase()}`}>{ESTADO_PEDIDO[estado]}</span>
}
