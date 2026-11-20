import type { Role } from '../types.ts'

// Usuarios que han iniciado sesión en este navegador, con su rol y último acceso.
// Es el respaldo de la página de usuarios del admin mientras no exista GET /api/admin/users.

export interface UsuarioConocido {
  username: string
  role: Role
  ultimoAcceso: string // ISO
}

const CLAVE = 'usuariosConocidos'

function leerMapa(): Record<string, UsuarioConocido> {
  try {
    const datos: unknown = JSON.parse(localStorage.getItem(CLAVE) ?? '{}')
    return datos && typeof datos === 'object' ? (datos as Record<string, UsuarioConocido>) : {}
  } catch {
    return {}
  }
}

export function registrarAcceso(username: string, role: Role) {
  const mapa = leerMapa()
  mapa[username] = { username, role, ultimoAcceso: new Date().toISOString() }
  try {
    localStorage.setItem(CLAVE, JSON.stringify(mapa))
  } catch {
    // Sin almacenamiento simplemente no se registra
  }
}

export function leerUsuariosConocidos(): UsuarioConocido[] {
  return Object.values(leerMapa()).sort((a, b) => b.ultimoAcceso.localeCompare(a.ultimoAcceso))
}
