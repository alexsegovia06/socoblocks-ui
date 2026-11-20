import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { SetColeccionable } from '../data/sets.ts'

// Publicar / despublicar un set desde el panel del vendedor.
// El backend manda `active` en cada set; los cambios hechos aquí se guardan en el navegador
// y tienen prioridad, para que el switch funcione mientras no exista el endpoint.
// TODO: reemplazar por PATCH /api/sets/{id} { active } cuando exista.

const CLAVE = 'setsActivos'
const oyentes = new Set<() => void>()

function suscribirse(avisar: () => void) {
  oyentes.add(avisar)
  window.addEventListener('storage', avisar)
  return () => {
    oyentes.delete(avisar)
    window.removeEventListener('storage', avisar)
  }
}

function leerTexto() {
  try {
    return localStorage.getItem(CLAVE) ?? '{}'
  } catch {
    return '{}'
  }
}

function aMapa(texto: string): Record<number, boolean> {
  try {
    const datos: unknown = JSON.parse(texto)
    return datos && typeof datos === 'object' ? (datos as Record<number, boolean>) : {}
  } catch {
    return {}
  }
}

export function useEstadoSets() {
  const texto = useSyncExternalStore(suscribirse, leerTexto)
  const cambios = useMemo(() => aMapa(texto), [texto])

  const estaActivo = useCallback((set: SetColeccionable) => cambios[set.id] ?? set.activo, [cambios])

  const cambiarActivo = useCallback((id: number, activo: boolean) => {
    const siguiente = { ...aMapa(leerTexto()), [id]: activo }
    try {
      localStorage.setItem(CLAVE, JSON.stringify(siguiente))
    } catch {
      return
    }
    oyentes.forEach((avisar) => avisar())
  }, [])

  return { estaActivo, cambiarActivo }
}
