import { Link } from 'react-router'
import { Blocks, X } from 'lucide-react'
import SeccionPerfil, { FilaSet } from '../SeccionPerfil/SeccionPerfil.tsx'
import { SETS, formatoPrecio } from '../../data/sets.ts'
import type { SetColeccionable } from '../../data/sets.ts'
import { useColeccion } from '../../coleccion/useColeccion.ts'
import './Coleccion.css'

export default function Coleccion() {
  const { ids, remove } = useColeccion()

  // Los ids guardados que ya no existan en el catálogo simplemente no se cuentan ni se muestran
  const sets = ids
    .map((id) => SETS.find((s) => s.id === id))
    .filter((s): s is SetColeccionable => s !== undefined)

  const total = SETS.length
  const porcentaje = total === 0 ? 0 : Math.round((sets.length / total) * 100)
  const piezas = sets.reduce((suma, s) => suma + s.piezas, 0)
  // Suma de los precios actuales del catálogo, no de lo que se pagó
  const valor = sets.reduce((suma, s) => suma + s.precio, 0)

  return (
    <SeccionPerfil
      id="coleccion-titulo"
      titulo="Mi colección"
      icono={<Blocks size={18} />}
      contador={`${sets.length} de ${total} sets`}
    >
      <div className="coleccion__progreso">
        <div
          className="coleccion__barra"
          role="progressbar"
          aria-label="Sets del catálogo que ya tienes"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={sets.length}
        >
          <div className="coleccion__relleno" style={{ width: `${porcentaje}%` }} />
        </div>
        <span className="coleccion__porcentaje">{porcentaje}% del catálogo</span>
      </div>

      {sets.length === 0 ? (
        <div className="seccion-perfil__vacio">
          <p>Todavía no tienes sets en tu colección.</p>
          <p>Toca «Ya lo tengo» en la página de un set, o pásalo desde tu wishlist.</p>
          <Link to="/" className="seccion-perfil__explorar">
            Explorar el catálogo
          </Link>
        </div>
      ) : (
        <>
          <dl className="coleccion__stats">
            <div className="coleccion__stat">
              <dt>Piezas totales</dt>
              <dd>{piezas.toLocaleString('es-MX')}</dd>
            </div>
            <div className="coleccion__stat">
              <dt>Valor estimado</dt>
              <dd>{formatoPrecio(valor)} MXN</dd>
            </div>
          </dl>

          <ul className="seccion-perfil__lista">
            {sets.map((set) => (
              <FilaSet key={set.id} set={set}>
                <button
                  type="button"
                  className="fila-set__boton"
                  aria-label={`Quitar ${set.nombre} de mi colección`}
                  onClick={() => remove(set.id)}
                >
                  <X size={16} />
                </button>
              </FilaSet>
            ))}
          </ul>
        </>
      )}
    </SeccionPerfil>
  )
}
