import { useCatalogo } from '../catalogo/useCatalogo.ts'
import type { SetColeccionable } from '../data/sets.ts'
import { useCarrito } from './CarritoContext.tsx'

export interface LineaCarrito {
  set: SetColeccionable
  cantidad: number
  // Hay menos stock que lo que está en el carrito (el stock bajó después de agregarlo)
  sinStockSuficiente: boolean
}

// Une los items del carrito con los datos actuales del catálogo (nombre, precio, stock, imagen).
export function useLineasCarrito() {
  const carrito = useCarrito()
  const { sets, cargando } = useCatalogo()

  // Un set que ya no existe en el catálogo no se muestra ni se cobra
  const lineas: LineaCarrito[] = carrito.items.flatMap((item) => {
    const set = sets.find((s) => s.id === item.setId)
    return set ? [{ set, cantidad: item.cantidad, sinStockSuficiente: item.cantidad > set.stock }] : []
  })

  const subtotal = lineas.reduce((suma, l) => suma + l.set.precio * l.cantidad, 0)
  const puedePagar = lineas.length > 0 && lineas.every((l) => !l.sinStockSuficiente)

  return { lineas, subtotal, puedePagar, cargando }
}
