import { Navigate, Outlet } from 'react-router'
import type { Role } from '../types.ts'
import { useAuth } from './AuthContext.tsx'

const HOME_BY_ROLE: Record<Role, string> = {
  COLECCIONISTA: '/',
  VENDEDOR: '/vendedor',
  ADMIN: '/',
}

export function homeFor(role: Role) {
  return HOME_BY_ROLE[role] ?? '/'
}

export function RequireRole({ role }: { role: Role }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={homeFor(user.role)} replace />
  return <Outlet />
}

export function PublicOnly() {
  const { user } = useAuth()

  if (user) return <Navigate to={homeFor(user.role)} replace />
  return <Outlet />
}

export function Redirect() {
  const { user } = useAuth()
  return <Navigate to={user ? homeFor(user.role) : '/'} replace />
}