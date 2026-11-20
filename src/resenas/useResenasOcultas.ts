import { useCallback, useMemo, useSyncExternalStore } from 'react'

// Reseñas que el admin ocultó por moderación (ids). Las ocultas no se muestran en el detalle del set.
// TODO: reemplazar por PATCH /api/resenas/{id} { visible } cuando exista el endpoint de reseñas.

const CLAVE = 'resenasOcultas'
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
    return localStorage.getItem(CLAVE) ?? '[]'
  } catch {
    return '[]'
  }
}

function aIds(texto: string): number[] {
  try {
    const datos: unknown = JSON.parse(texto)
    return Array.isArray(datos) ? datos.filter((n): n is number => typeof n === 'number') : []
  } catch {
    return []
  }
}

export function useResenasOcultas() {
  const texto = useSyncExternalStore(suscribirse, leerTexto)
  const ocultas = useMemo(() => aIds(texto), [texto])

  const estaOculta = useCallback((id: number) => ocultas.includes(id), [ocultas])

  const cambiarVisible = useCallback((id: number, visible: boolean) => {
    const actual = aIds(leerTexto()).filter((x) => x !== id)
    try {
      localStorage.setItem(CLAVE, JSON.stringify(visible ? actual : [...actual, id]))
    } catch {
      return
    }
    oyentes.forEach((avisar) => avisar())
  }, [])

  return { estaOculta, cambiarVisible }
}
