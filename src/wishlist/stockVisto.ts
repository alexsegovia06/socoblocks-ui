// Último stock que el coleccionista vio de cada set de su wishlist, para avisarle
// "¡Volvió a haber stock!" cuando un set que estaba agotado regresa.
// TODO: cuando el backend mande notificaciones, esto ya no hace falta.

type Foto = Record<number, number> // setId -> stock

const clave = (username: string) => `stockVisto:${username}`

export function leerStockVisto(username: string): Foto {
  try {
    const datos: unknown = JSON.parse(localStorage.getItem(clave(username)) ?? '{}')
    return datos && typeof datos === 'object' ? (datos as Foto) : {}
  } catch {
    return {}
  }
}

export function guardarStockVisto(username: string, foto: Foto) {
  try {
    localStorage.setItem(clave(username), JSON.stringify(foto))
  } catch {
    // Sin almacenamiento simplemente no hay aviso de "volvió"
  }
}
