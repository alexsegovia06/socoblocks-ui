import type { ReactNode } from 'react'
import './StatCard.css'

export type StatTone = 'green' | 'slate' | 'amber'

interface Props {
  label: string
  value: string
  unit: string
  icon: ReactNode
  tone: StatTone
  footer: ReactNode
}

export default function StatCard({ label, value, unit, icon, tone, footer }: Props) {
  return (
    <article className={`seller-stat-card seller-stat-card--${tone}`}>
      <div className="seller-stat-card__body">
        <span className="seller-stat-card__label">{label}</span>
        <p className="seller-stat-card__value">
          <strong>{value}</strong>
          <span>{unit}</span>
        </p>
        <div className="seller-stat-card__footer">{footer}</div>
      </div>
      <span className="seller-stat-card__icon">{icon}</span>
    </article>
  )
}
