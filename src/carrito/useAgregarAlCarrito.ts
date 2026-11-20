import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext.tsx'
import type { SetColeccionable } from '../data/sets.ts'
import { useToast } from '../toast/ToastContext.tsx'
import { useCarrito } from './CarritoContext.tsx'

// "Agregar al carrito" con su aviso. Lo usan el catálogo y el detalle del set.
// Sin sesión manda a iniciar sesión.
export function useAgregarAlCarrito() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const carrito = useCarrito()
  const toast = useToast()

  return useCallback(
    (set: SetColeccionable, cantidad = 1) => {
      if (!user) {
        navigate('/login')
        return
      }
      const agregadas = carrito.agregar(set, cantidad)
      const verCarrito = { texto: 'Ver carrito', onClick: carrito.abrir }

      if (agregadas === 0) {
        toast.info(`Ya tienes en tu carrito todo el stock de ${set.nombre}.`, { accion: verCarrito })
      } else if (agregadas < cantidad) {
        toast.info(`Solo había stock para ${agregadas} más de ${set.nombre}.`, { accion: verCarrito })
      } else {
        const unidades = agregadas > 1 ? ` (${agregadas})` : ''
        toast.exito(`${set.nombre}${unidades} se agregó al carrito.`, { accion: verCarrito })
      }
    },
    [user, navigate, carrito, toast],
  )
}
