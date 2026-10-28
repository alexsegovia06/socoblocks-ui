import { Plus } from 'lucide-react'
import './AddButton.css'

interface Props {
  onClick: () => void
  disabled?: boolean
}

export default function AddButton({ onClick, disabled = false }: Props) {
  return (
    <button type="button" className="boton-agregar" onClick={onClick} disabled={disabled}>
      <Plus size={16} />
      Agregar
    </button>
  )
}
