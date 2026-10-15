import { useState, type FormEvent } from 'react'
import { Heart, Store, UserPlus } from 'lucide-react'
import AuthHero from "../../components/AuthHero/AuthHero.tsx";
import AuthTabs from "../../components/AuthTabs/AuthTabs.tsx"
import { useAuth } from '../../auth/AuthContext'
import type { Role } from '../../types.ts'
import '../LoginPage/AuthPages.css'
import './RegisterPage.css'

// Roles que el backend permite autoasignarse al registrarse
type Participacion = Exclude<Role, 'ADMIN'>

const OPCIONES = [
  { value: 'COLECCIONISTA', titulo: 'Coleccionista', descripcion: 'Comprar sets y armar', Icon: Heart },
  { value: 'VENDEDOR', titulo: 'Vendedor', descripcion: 'Publicar mis propios MOCs', Icon: Store },
] as const

export default function RegisterPage() {
  const { register } = useAuth()
  // TODO: nombre no se envía todavía: RegisterRequest del backend solo recibe username, password y role.
  const [nombre, setNombre] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [participacion, setParticipacion] = useState<Participacion>('COLECCIONISTA')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(username, password, participacion)
      // register hace login y PublicOnly redirige según el rol (homeFor).
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

          <form className="auth-form register__form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-nombre">
                Nombre completo
              </label>
              <input
                id="reg-nombre"
                className="auth-input"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Socorro Lomelí"
                autoComplete="name"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-username">
                Correo electrónico
              </label>
              <input
                id="reg-username"
                className="auth-input"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="máximoAlejandroRosadoDelaRosa@gmail.com"
                autoComplete="email"
                minLength={3}
                maxLength={50}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-password">
                Crear contraseña
              </label>
              <input
                id="reg-password"
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
              />
            </div>

            <fieldset className="register__roles">
              <legend className="auth-label">¿Cómo deseas participar?</legend>
              <div className="register__roles-grid">
                {OPCIONES.map(({ value, titulo, descripcion, Icon }) => {
                  const selected = participacion === value
                  return (
                    <label key={value} className={`register__role${selected ? ' register__role--selected' : ''}`}>
                      <input
                        type="radio"
                        name="participacion"
                        value={value}
                        checked={selected}
                        onChange={() => setParticipacion(value)}
                      />
                      <span className="register__radio" />
                      <Icon className="register__role-icon" size={17} />
                      <strong>{titulo}</strong>
                      <small>{descripcion}</small>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            {error && <p className="error">{error}</p>}

            <button className="auth-submit" disabled={loading}>
              {loading ? 'Creando cuenta…' : 'Crear Cuenta'}
              {!loading && <UserPlus size={18} />}
            </button>
          </form>

          <p className="auth-legal">Al registrarte aceptas las Condiciones de la Comunidad de Creadores.</p>
        </div>
      </section>
    </main>
  )
}
