import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import './ActionCard.css'

interface Props {
  title: string
  description: string
  icon: ReactNode
  tone: 'red' | 'slate'
  // Página a la que lleva la tarjeta; sin él se muestra como tarjeta informativa (no es enlace)
  to?: string
}

export default function ActionCard({ title, description, icon, tone, to }: Props) {
  const contenido = (
    <div className="action-card__body">
      <span className="action-card__icon">{icon}</span>
      <h2 className="action-card__title">{title}</h2>
      <p className="action-card__description">{description}</p>
    </div>
  )

  if (!to) return <div className={`action-card action-card--${tone}`}>{contenido}</div>

  return (
    <Link to={to} className={`action-card action-card--${tone}`}>
      {contenido}
      <ChevronRight className="action-card__chevron" size={26} />
    </Link>
  )
}
