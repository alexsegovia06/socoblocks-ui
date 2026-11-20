import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.ts'
import type { ApiError } from '../api.ts'
import { toSet } from '../data/mapSet.ts'
import type { SetApi } from '../data/mapSet.ts'
import type { SetColeccionable } from '../data/sets.ts'

// Única fuente de los sets: el catálogo del backend (/api/catalogo).
// Catálogo, detalle, wishlist y colección leen de aquí, así todos ven los mismos ids, precios y stock.
//
// La última respuesta se guarda en memoria: al pasar del catálogo al detalle el set se muestra
// al instante y, por detrás, se vuelve a pedir para tener el stock al día.

let ultimo: SetColeccionable[] | null = null
let enCurso: Promise<SetColeccionable[]> | null = null

// Si varios componentes piden el catálogo a la vez, comparten la misma petición
function pedirCatalogo(): Promise<SetColeccionable[]> {
  if (!enCurso) {
    enCurso = api<SetApi[]>('/api/catalogo')
      .then((data) => (ultimo = data.map(toSet)))
      .finally(() => {
        enCurso = null
      })
  }
  return enCurso
}

export function useCatalogo() {
  const [sets, setSets] = useState<SetColeccionable[] | null>(ultimo)
  const [error, setError] = useState<string | null>(null)
  // Cambiarlo vuelve a disparar la petición (botón "Reintentar")
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let vigente = true // evita actualizar un componente que ya se desmontó
    pedirCatalogo()
      .then((data) => {
        if (!vigente) return
        setSets(data)
        setError(null)
      })
      .catch((e: ApiError) => {
        if (vigente) setError(e.message)
      })
    return () => {
      vigente = false
    }
  }, [intento])

  const recargar = useCallback(() => {
    setError(null)
    setIntento((n) => n + 1)
  }, [])

  return {
    sets: sets ?? [],
    // Solo está "cargando" la primera vez; si ya hay datos guardados se muestran mientras se actualizan
    cargando: sets === null && error === null,
    error,
    recargar,
  }
}
