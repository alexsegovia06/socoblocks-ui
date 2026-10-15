export type Role = 'COLECCIONISTA' | 'VENDEDOR' | 'ADMIN'

export interface User {
  username: string
  role: Role
}

export interface MeResponse {
  username: string
  role: Role
  expiresAt: string
}