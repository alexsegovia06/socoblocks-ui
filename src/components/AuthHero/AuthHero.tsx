import { Sparkles } from 'lucide-react'
import './AuthHero.css'

export default function AuthHero() {
  return (
    <aside className="auth-hero">
      <span className="auth-hero__pill">
        <Sparkles size={14} />
        Bloques de Nostalgia Mexicana
      </span>

      <h1 className="auth-hero__title">Construye la historia más viral de México.</h1>
      <p className="auth-hero__text">
        Desde el río de San Carlos hasta los foros de la televisión nacional. Colecciona, arma y ríe pieza por pieza.
      </p>

      <div className="auth-hero__deco" aria-hidden="true">
        <span className="auth-hero__block auth-hero__block--top" />
        <span className="auth-hero__block auth-hero__block--bottom" />
        <span className="auth-hero__block auth-hero__block--tall" />
      </div>

      <div className="auth-hero__footer">
        <span className="auth-hero__avatar">MX</span>
        <div>
          <strong>Hecho por y para fanáticos</strong>
          <small>Diseños 100% compatibles con marcas líderes</small>
        </div>
      </div>
    </aside>
  )
}
