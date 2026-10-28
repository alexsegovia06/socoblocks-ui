import { useListaDeSets } from '../listas/useListaDeSets.ts'

// Sets que el usuario ya tiene
export function useColection() {
  return useListaDeSets('coleccion')
}
