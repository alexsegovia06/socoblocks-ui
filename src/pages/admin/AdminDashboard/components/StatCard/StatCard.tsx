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
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__body">
        <span className="stat-card__label">{label}</span>
        <p className="stat-card__value">
          <strong>{value}</strong>
          <span>{unit}</span>
        </p>
        <div className="stat-card__footer">{footer}</div>
      </div>
      <span className="stat-card__icon">{icon}</span>
    </article>
  )
}
