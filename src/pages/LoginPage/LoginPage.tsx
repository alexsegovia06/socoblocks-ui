import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import AuthHero from "../../components/AuthHero/AuthHero.tsx";
import AuthTabs from '../../components/AuthTabs/AuthTabs.tsx'
import { useAuth } from '../../auth/AuthContext.tsx'
import './LoginPage.css'
import './AuthPages.css'

export default function LoginPage() {
  const { login } = useAuth()
  //El campo "Correo electrónico" del diseño se envía como `username` (es lo que recibe /api/auth/login).
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
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
              <div className="auth-password">
                <input
                    id="login-password"
                    className="auth-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                />
                <button
                    type="button"
                    className="auth-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={showPassword}
                >
                  {/* Aquí tus íconos, por ejemplo: showPassword ? <EyeOff size={18} /> : <Eye size={18} /> */}
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
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
