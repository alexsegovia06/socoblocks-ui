import { useCallback, useEffect, useSyncExternalStore } from 'react'

// Tema claro / oscuro. El tema activo es el atributo data-theme de <html>:
// los colores de src/index.css cambian según ese atributo.
// index.html ya lo pone antes de pintar la página (así no hay destello blanco al cargar).
// Si la persona nunca eligió, se sigue el tema del sistema operativo.

export type Tema = 'light' | 'dark'

const CLAVE = 'tema'
const oyentes = new Set<() => void>()

function temaActual(): Tema {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function aplicar(tema: Tema) {
  document.documentElement.dataset.theme = tema
  oyentes.forEach((avisar) => avisar())
}

function suscribirse(avisar: () => void) {
  oyentes.add(avisar)
  return () => {
    oyentes.delete(avisar)
  }
}

function eligioAntes(): boolean {
  try {
    const guardado = localStorage.getItem(CLAVE)
    return guardado === 'light' || guardado === 'dark'
  } catch {
    return false
  }
}

export function useTema() {
  const tema = useSyncExternalStore(suscribirse, temaActual)

  // Mientras no haya elegido, si cambia el tema del sistema se cambia aquí también
  useEffect(() => {
    const consulta = window.matchMedia('(prefers-color-scheme: dark)')
    const alCambiar = (e: MediaQueryListEvent) => {
      if (!eligioAntes()) aplicar(e.matches ? 'dark' : 'light')
    }
    consulta.addEventListener('change', alCambiar)
    return () => consulta.removeEventListener('change', alCambiar)
  }, [])

  const alternar = useCallback(() => {
    const siguiente: Tema = temaActual() === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(CLAVE, siguiente)
    } catch {
      // Sin almacenamiento el tema cambia, solo no se recuerda al recargar
    }
    aplicar(siguiente)
  }, [])

  return { tema, alternar }
}
