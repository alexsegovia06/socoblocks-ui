import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import AuthHero from "../../components/AuthHero/AuthHero.tsx";
import AuthTabs from '../../components/AuthTabs/AuthTabs.tsx'
import { useAuth } from '../../auth/AuthContext.tsx'
import './LoginPage.css'
import './AuthPages.css'

export default function LoginPage() {
  const { login } = useAuth()
  // El campo "Correo electrónico" del diseño se envía como `username` (es lo que recibe /api/auth/login).
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      // PublicOnly redirige a /user o /admin cuando user deja de ser null.
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <main className="auth-main">
      <section className="auth-card">
        <AuthHero />

        <div className="auth-panel">
          <AuthTabs />

          <form className="auth-form login__form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-username">
                Correo electrónico
              </label>
              <input
                id="login-username"
                className="auth-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="username"
                required
                autoFocus
              />
            </div>

            <div className="auth-field">
              <div className="auth-field__row">
                <label className="auth-label" htmlFor="login-password">
                  Contraseña
                </label>
                {/* Recuperar contraseña todavía no tiene ruta ni endpoint */}
                <a href="#recuperar" className="auth-link">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <input
                id="login-password"
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button className="auth-submit" disabled={loading}>
              {loading ? 'Entrando…' : 'Entrar a mi Cuenta'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-legal">Al registrarte aceptas las Condiciones de la Comunidad de Creadores.</p>
        </div>
      </section>
    </main>
  )
}
