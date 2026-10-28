import './OpcionList.css'

export interface Opcion {
  value: string
  label: string
}

interface Props {
  titulo: string
  opciones: Opcion[]
  seleccionadas: string[]
  onToggle: (value: string) => void
}

export default function OpcionList({ titulo, opciones, seleccionadas, onToggle }: Props) {
  return (
    <fieldset className="opciones">
      <legend className="opciones__titulo">{titulo}</legend>
      {opciones.map((opcion) => (
        <label key={opcion.value} className="opciones__item">
          <input
            type="checkbox"
            checked={seleccionadas.includes(opcion.value)}
            onChange={() => onToggle(opcion.value)}
          />
          <span>{opcion.label}</span>
        </label>
      ))}
    </fieldset>
  )
}
