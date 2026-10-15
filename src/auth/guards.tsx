import { Navigate, Outlet } from 'react-router'
import type { Role } from '../types.ts'
import { useAuth } from './AuthContext.tsx'

export function homeFor(role: Role) {
  if (role === 'ADMIN') return '/admin/dashboard'
  if (role === 'VENDEDOR') return '/seller/dashboard'
  return '/user'
}

export function RequireRole({ roles }: { roles: Role[] }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to={homeFor(user.role)} replace />
  return <Outlet />
}

export function PublicOnly() {
  const { user } = useAuth()

  if (user) return <Navigate to={homeFor(user.role)} replace />
  return <Outlet />
}

export function Redirect() {
  const { user } = useAuth()
  return <Navigate to={user ? homeFor(user.role) : '/login'} replace />
}
