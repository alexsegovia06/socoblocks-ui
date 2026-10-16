import { TriangleAlert } from 'lucide-react'
import './StockAlert.css'

export default function StockAlert() {
  return (
    <section className="stock-alert">
      <span className="stock-alert__icon">
        <TriangleAlert size={26} />
      </span>

      <div className="stock-alert__text">
        <h2>Alerta de bajo inventario crítico</h2>
        <p>
          El set <strong>"Se Vale: La Tirolesa"</strong> solo tiene <a href="#stock">3 unidades disponibles</a>. El set
          "El Ferras" se encuentra agotado (0 stock).
        </p>
      </div>

      <button type="button" className="stock-alert__button">
        Gestionar Stock Ahora
      </button>
    </section>
  )
}
