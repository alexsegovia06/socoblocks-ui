import './EtiquetaStock.css'

interface Props {
  stock: number
}

export default function EtiquetaStock({ stock }: Props) {
  const estado = stock === 0 ? 'agotado' : stock <= 5 ? 'ultimas' : 'disponible'
  const texto = stock === 0 ? 'Agotado' : stock <= 5 ? `¡Últimas ${stock} pzas!` : `Stock: ${stock}`

  return <span className={`etiqueta-stock etiqueta-stock--${estado}`}>{texto}</span>
}
