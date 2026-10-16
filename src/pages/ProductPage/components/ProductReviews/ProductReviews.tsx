import { MessageSquarePlus, Star } from 'lucide-react'
import type { Resena } from '../../../../data/sets.ts'
import './ProductReviews.css'

interface Props {
  resenas: Resena[]
}

const iniciales = (nombre: string) =>
  nombre
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()

export default function ProductReviews({ resenas }: Props) {
  return (
    <section className="product-reviews">
      <header className="product-reviews__header">
        <div>
          <h2>Reseñas de la Comunidad</h2>
          <p>Opiniones verificadas de coleccionistas</p>
        </div>

        <button type="button" className="product-reviews__escribir">
          <MessageSquarePlus size={24} />
          Escribir reseña
        </button>
      </header>

      {resenas.length > 0 && (
        <ul className="product-reviews__lista">
          {resenas.map((r) => (
            <li key={r.id} className="product-reviews__item">
              <div className="product-reviews__autor">
                <span className="product-reviews__avatar" aria-hidden="true">{iniciales(r.autor)}</span>
                <div>
                  <strong>{r.autor}</strong>
                  <small>Comprador Verificado</small>
                </div>
                <span className="product-reviews__estrellas" aria-label={`Calificación ${r.rating} de 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={22}
                      className={n <= r.rating ? 'product-reviews__estrella--llena' : undefined}
                    />
                  ))}
                </span>
              </div>
              <p className="product-reviews__comentario">"{r.comentario}"</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
