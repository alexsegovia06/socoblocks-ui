import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext.tsx'
import type { SetColeccionable } from '../data/sets.ts'

// Carrito del usuario con sesión, guardado en el navegador (localStorage) por usuario.
// Solo guarda ids y cantidades: el precio, nombre y stock siempre se leen del catálogo actual.
// Cuando exista el endpoint de carrito en el backend, solo cambia este archivo.

export interface ItemCarrito {
  setId: number
  cantidad: number
}

interface CarritoValue {
  items: ItemCarrito[]
  // Total de unidades (lo que muestra el globito del ícono)
  unidades: number
  // Devuelve cuántas unidades se agregaron de verdad (puede ser menos por el stock)
  agregar: (set: SetColeccionable, cantidad?: number) => number
  cambiarCantidad: (setId: number, cantidad: number) => void
  quitar: (setId: number) => void
  vaciar: () => void
  // Vuelve a poner una lista de items tal cual (para "Deshacer")
  restaurar: (items: ItemCarrito[]) => void
  // Panel lateral
  abierto: boolean
  abrir: () => void
  cerrar: () => void
}

const CarritoContext = createContext<CarritoValue | null>(null)

const clave = (username: string) => `carrito:${username}`

function leer(username: string | null): ItemCarrito[] {
  if (!username) return []
  try {
    const datos: unknown = JSON.parse(localStorage.getItem(clave(username)) ?? '[]')
    if (!Array.isArray(datos)) return []
    return datos.filter(
      (i): i is ItemCarrito =>
        typeof i?.setId === 'number' && typeof i?.cantidad === 'number' && i.cantidad > 0,
    )
  } catch {
    return [] // JSON dañado o localStorage bloqueado: carrito vacío
  }
}

function guardar(username: string, items: ItemCarrito[]) {
  try {
    localStorage.setItem(clave(username), JSON.stringify(items))
  } catch {
    // Sin almacenamiento el carrito sigue funcionando mientras la pestaña esté abierta
  }
}

export function CarritoProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const username = user?.username ?? null

  const [dueno, setDueno] = useState(username)
  const [items, setItems] = useState<ItemCarrito[]>(() => leer(username))
  const [abierto, setAbierto] = useState(false)

  // Al cambiar de sesión (login/logout) se carga el carrito de ese usuario
  if (dueno !== username) {
    setDueno(username)
    setItems(leer(username))
    setAbierto(false)
  }

  // Siempre los items más recientes, aunque quien llame tenga una función de un render anterior
  // (p. ej. el botón "Deshacer" de un aviso)
  const itemsRef = useRef(items)

  useEffect(() => {
    itemsRef.current = items
    if (username) guardar(username, items)
  }, [username, items])

  const agregar = useCallback((set: SetColeccionable, cantidad = 1) => {
    const actual = itemsRef.current.find((i) => i.setId === set.id)?.cantidad ?? 0
    // Nunca más unidades de las que hay en stock
    const agregadas = Math.max(0, Math.min(cantidad, set.stock - actual))
    if (agregadas === 0) return 0
    setItems((prev) =>
      actual > 0
        ? prev.map((i) => (i.setId === set.id ? { ...i, cantidad: i.cantidad + agregadas } : i))
        : [...prev, { setId: set.id, cantidad: agregadas }],
    )
    return agregadas
  }, [])

  const cambiarCantidad = useCallback((setId: number, cantidad: number) => {
    setItems((prev) =>
      cantidad <= 0
        ? prev.filter((i) => i.setId !== setId)
        : prev.map((i) => (i.setId === setId ? { ...i, cantidad } : i)),
    )
  }, [])

  const quitar = useCallback((setId: number) => {
    setItems((prev) => prev.filter((i) => i.setId !== setId))
  }, [])

  const vaciar = useCallback(() => setItems([]), [])
  const restaurar = useCallback((lista: ItemCarrito[]) => setItems(lista), [])
  const abrir = useCallback(() => setAbierto(true), [])
  const cerrar = useCallback(() => setAbierto(false), [])

  const value = useMemo<CarritoValue>(
    () => ({
      items,
      unidades: items.reduce((suma, i) => suma + i.cantidad, 0),
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
      restaurar,
      abierto,
      abrir,
      cerrar,
    }),
    [items, agregar, cambiarCantidad, quitar, vaciar, restaurar, abierto, abrir, cerrar],
  )

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
}

export function useCarrito() {
  const value = useContext(CarritoContext)
  if (!value) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>')
  return value
}
