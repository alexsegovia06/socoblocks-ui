import { useListaDeSets } from '../listas/useListaDeSets.ts'

// Sets que el usuario ya tiene
export function useColeccion() {
  return useListaDeSets('coleccion')
}
