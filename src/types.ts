// El INVITADO (visitante sin cuenta) no es un rol: es cuando no hay sesión (user === null).
export type Role = 'COLECCIONISTA' | 'VENDEDOR' | 'ADMIN'

export interface User {
  username: string
  role: Role
}

// GET /api/user/me
export interface MeResponse {
  username: string
  role: Role
  expiresAt: string
}
