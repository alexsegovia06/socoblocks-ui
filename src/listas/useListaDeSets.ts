import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { useAuth } from '../auth/AuthContext.tsx'

// Listas de sets guardadas en el navegador (localStorage): una por usuario y por tipo,
// con solo los ids de los sets. La wishlist y la colección usan este mismo mecanismo.
//
// Todo el acceso a los datos está en este archivo. El día que el catálogo venga del backend,
// aquí se cambia localStorage por peticiones a la API y los componentes no se enteran.

export type NombreLista = 'wishlist' | 'coleccion'

// Importante: 'wishlist:<usuario>' es la misma clave que ya se usaba, así que lo guardado se conserva
const clave = (nombre: NombreLista, username: string) => `${nombre}:${username}`

// Cada componente que usa el hook se registra aquí para enterarse cuando una lista cambia
const oyentes = new Set<() => void>()

function suscribirse(avisar: () => void) {
  oyentes.add(avisar)
  window.addEventListener('storage', avisar) // cambios hechos desde otra pestaña
  return () => {
    oyentes.delete(avisar)
    window.removeEventListener('storage', avisar)
  }
}

// localStorage puede fallar (modo privado, almacenamiento lleno): en ese caso se trabaja con lista vacía
function leerTexto(nombre: NombreLista, username: string | null): string {
  if (!username) return '[]'
  try {
    return localStorage.getItem(clave(nombre, username)) ?? '[]'
  } catch {
    return '[]'
  }
}

function aIds(texto: string): number[] {
  try {
    const datos: unknown = JSON.parse(texto)
    return Array.isArray(datos) ? datos.filter((n): n is number => typeof n === 'number') : []
  } catch {
    return [] // JSON dañado: se ignora
  }
}

function guardar(nombre: NombreLista, username: string, ids: number[]) {
  try {
    localStorage.setItem(clave(nombre, username), JSON.stringify(ids))
  } catch {
    return
  }
  oyentes.forEach((avisar) => avisar())
}

export function useListaDeSets(nombre: NombreLista) {
  const { user } = useAuth()
  const username = user?.username ?? null

  // useSyncExternalStore mantiene sincronizados todos los componentes que muestran la lista.
  // Leemos el texto (un string, estable entre renders) y lo convertimos a ids solo cuando cambia.
  const texto = useSyncExternalStore(suscribirse, () => leerTexto(nombre, username))
  const ids = useMemo(() => aIds(texto), [texto]) // el más reciente primero

  const has = useCallback((id: number) => ids.includes(id), [ids])

  const add = useCallback(
    (id: number) => {
      if (!username) return
      const actual = aIds(leerTexto(nombre, username))
      if (!actual.includes(id)) guardar(nombre, username, [id, ...actual])
    },
    [nombre, username],
  )

  const remove = useCallback(
    (id: number) => {
      if (!username) return
      guardar(nombre, username, aIds(leerTexto(nombre, username)).filter((x) => x !== id))
    },
    [nombre, username],
  )

  const toggle = useCallback(
    (id: number) => {
      if (!username) return
      const actual = aIds(leerTexto(nombre, username))
      guardar(nombre, username, actual.includes(id) ? actual.filter((x) => x !== id) : [id, ...actual])
    },
    [nombre, username],
  )

  return { ids, has, add, remove, toggle }
}
