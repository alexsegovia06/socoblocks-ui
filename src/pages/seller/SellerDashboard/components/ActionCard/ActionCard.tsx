import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import './ActionCard.css'

interface Props {
  title: string
  description: string
  icon: ReactNode
  tone: 'red' | 'slate'
}

export default function ActionCard({ title, description, icon, tone }: Props) {
  return (
    <a href="#" className={`seller-action-card seller-action-card--${tone}`}>
      <div className="seller-action-card__body">
        <span className="seller-action-card__icon">{icon}</span>
        <h2 className="seller-action-card__title">{title}</h2>
        <p className="seller-action-card__description">{description}</p>
      </div>
      <ChevronRight className="seller-action-card__chevron" size={26} />
    </a>
  )
}
