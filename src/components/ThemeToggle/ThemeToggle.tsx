import { Moon, Sun } from 'lucide-react'
import { useTema } from '../../tema/useTema.ts'
import './ThemeToggle.css'

// Botón de la navbar para cambiar entre modo claro y oscuro.
// En modo claro se ve el sol; al picarle pasa a oscuro y se ve la luna.
export default function ThemeToggle() {
  const { tema, alternar } = useTema()
  const oscuro = tema === 'dark'
  const accion = oscuro ? 'Activar modo claro' : 'Activar modo oscuro'

  return (
    <button type="button" className="theme-toggle" onClick={alternar} aria-label={accion} title={accion}>
      {oscuro ? <Moon size={19} /> : <Sun size={19} />}
    </button>
  )
}
