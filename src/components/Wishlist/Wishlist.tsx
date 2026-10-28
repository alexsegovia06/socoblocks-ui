import { Heart, PackageCheck, X } from 'lucide-react'
import EtiquetaStock from '../EtiquetaStock/EtiquetaStock.tsx'
import SeccionPerfil, { FilaSet } from '../SeccionPerfil/SeccionPerfil.tsx'
import { SETS } from '../../data/sets.ts'
import type { SetColeccionable } from '../../data/sets.ts'
import { useColeccion } from '../../coleccion/useColeccion.ts'
import { useWishlist } from '../../wishlist/useWishlist.ts'

export default function Wishlist() {
  const { ids, remove } = useWishlist()
  const coleccion = useColeccion()

  // Los ids guardados que ya no existan en el catálogo simplemente no se muestran
  const sets = ids
    .map((id) => SETS.find((s) => s.id === id))
    .filter((s): s is SetColeccionable => s !== undefined)

  // Un set que ya tienes deja de ser un deseo: pasa de la wishlist a la colección
  function yaLoTengo(id: number) {
    coleccion.add(id)
    remove(id)
  }

  return (
    <SeccionPerfil
      id="wishlist-titulo"
      titulo="Mi wishlist"
      icono={<Heart size={18} />}
      contador={`${sets.length} ${sets.length === 1 ? 'set' : 'sets'}`}
    >
      {sets.length === 0 ? (
        <div className="seccion-perfil__vacio">
          <p>Aún no has guardado ningún set.</p>
          <p>Toca el corazón en la página de un set para tenerlo aquí.</p>
        </div>
      ) : (
        <ul className="seccion-perfil__lista">
          {sets.map((set) => (
            <FilaSet key={set.id} set={set}>
              <EtiquetaStock stock={set.stock} />
              <div className="fila-set__acciones">
                <button
                  type="button"
                  className="fila-set__boton fila-set__boton--texto fila-set__boton--ok"
                  aria-label={`Ya tengo ${set.nombre}: pasarlo a mi colección`}
                  onClick={() => yaLoTengo(set.id)}
                >
                  <PackageCheck size={15} />
                  Ya lo tengo
                </button>
                <button
                  type="button"
                  className="fila-set__boton"
                  aria-label={`Quitar ${set.nombre} de mi wishlist`}
                  onClick={() => remove(set.id)}
                >
                  <X size={16} />
                </button>
              </div>
            </FilaSet>
          ))}
        </ul>
      )}
    </SeccionPerfil>
  )
}
