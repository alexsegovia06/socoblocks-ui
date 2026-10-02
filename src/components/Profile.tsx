import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext.tsx'
import type { MeResponse } from '../types.ts'

export default function Profile() {
  const { authFetch } = useAuth()
  const [me, setMe] = useState<MeResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    authFetch<MeResponse>('/api/user/me')
      .then(setMe)
      .catch((err: Error) => setError(err.message))
  }, [])

  if (error) return <p className="error">{error}</p>
  if (!me) return <p className="muted">Loading…</p>

  return (
    <div className="card">
      <dl>
        <dt>Username</dt>
        <dd>{me.username}</dd>
        <dt>Role</dt>
        <dd>{me.role}</dd>
      </dl>
    </div>
  )
}
