import { Plus } from 'lucide-react'
import './BotonAgregar.css'

interface Props {
  onClick: () => void
  disabled?: boolean
}

export default function BotonAgregar({ onClick, disabled = false }: Props) {
  return (
    <button type="button" className="boton-agregar" onClick={onClick} disabled={disabled}>
      <Plus size={16} />
      Agregar
    </button>
  )
}
