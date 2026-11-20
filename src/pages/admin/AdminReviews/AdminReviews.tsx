import { useState } from 'react'
import { Link } from 'react-router'
import { Eye, EyeOff, Info, MessageSquareOff, Star } from 'lucide-react'
import { useCatalogo } from '../../../catalogo/useCatalogo.ts'
import { RESENAS, type Resena } from '../../../data/sets.ts'
import { useResenasOcultas } from '../../../resenas/useResenasOcultas.ts'
import { useToast } from '../../../toast/ToastContext.tsx'
import '../admin.css'
import './AdminReviews.css'

type Filtro = 'visibles' | 'ocultas' | 'todas'

export default function AdminReviews() {
  const { sets } = useCatalogo()
  const { estaOculta, cambiarVisible } = useResenasOcultas()
  const toast = useToast()
  const [filtro, setFiltro] = useState<Filtro>('todas')

  // TODO: cuando exista el endpoint de reseñas, pedirlas al backend
  const resenas = RESENAS
  const ocultas = resenas.filter((r) => estaOculta(r.id)).length
  const visibles = resenas.filter((r) => filtro === 'todas' || (filtro === 'ocultas') === estaOculta(r.id))

  function cambiar(r: Resena, visible: boolean) {
    cambiarVisible(r.id, visible)
    const deshacer = { texto: 'Deshacer', onClick: () => cambiarVisible(r.id, !visible) }
    if (visible) toast.exito(`La reseña de ${r.autor} vuelve a ser pública.`, { accion: deshacer })
    else toast.info(`La reseña de ${r.autor} se ocultó.`, { accion: deshacer })
  }

  const FILTROS: { id: Filtro; label: string; cuenta: number }[] = [
    { id: 'todas', label: 'Todas', cuenta: resenas.length },
    { id: 'visibles', label: 'Públicas', cuenta: resenas.length - ocultas },
    { id: 'ocultas', label: 'Ocultas', cuenta: ocultas },
  ]

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1>Moderación de reseñas</h1>
        <p>Oculta las reseñas que no respeten las reglas de la comunidad</p>
      </header>

      <p className="admin-page__aviso" role="status">
        <Info size={16} />
        Las reseñas todavía son datos de ejemplo: el backend aún no tiene endpoint de reseñas. Lo que ocultes aquí
        deja de verse en el detalle del set en este navegador.
      </p>

      <div className="admin-page__barra">
        <div className="admin-page__pestanas" role="group" aria-label="Filtrar reseñas">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              className="admin-page__pestana"
              aria-pressed={filtro === f.id}
              onClick={() => setFiltro(f.id)}
            >
              {f.label}
              <span>{f.cuenta}</span>
            </button>
          ))}
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="admin-page__card admin-page__vacio">
          <MessageSquareOff size={32} />
          <strong>No hay reseñas en esta vista</strong>
        </div>
      ) : (
        <ul className="admin-reviews">
          {visibles.map((r) => {
            const oculta = estaOculta(r.id)
            const set = sets.find((s) => s.id === r.setId)
            return (
              <li key={r.id} className={`admin-reviews__item${oculta ? ' admin-reviews__item--oculta' : ''}`}>
                <div className="admin-reviews__cabeza">
                  <div>
                    <strong>{r.autor}</strong>
                    <span className="admin-page__tenue">
                      {' '}
                      sobre {set ? <Link to={`/products/${set.id}`}>{set.nombre}</Link> : `set #${r.setId}`}
                    </span>
                  </div>
                  <span className="admin-reviews__estrellas" aria-label={`Calificación ${r.rating} de 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={15} className={n <= r.rating ? 'admin-reviews__estrella--llena' : undefined} />
                    ))}
                  </span>
                </div>

                <p className="admin-reviews__comentario">"{r.comentario}"</p>

                <div className="admin-reviews__pie">
                  <span className={`admin-page__etiqueta admin-page__etiqueta--${oculta ? 'off' : 'ok'}`}>
                    {oculta ? 'Oculta' : 'Pública'}
                  </span>
                  {oculta ? (
                    <button
                      type="button"
                      className="admin-page__boton admin-page__boton--suave"
                      onClick={() => cambiar(r, true)}
                    >
                      <Eye size={15} />
                      Volver a mostrar
                    </button>
                  ) : (
                    <button type="button" className="admin-page__boton" onClick={() => cambiar(r, false)}>
                      <EyeOff size={15} />
                      Ocultar
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
