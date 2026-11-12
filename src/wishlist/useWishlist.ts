import { useListaDeSets } from '../listas/useListaDeSets.ts'

// Sets que el usuario quiere conseguir
export function useWishlist() {
  return useListaDeSets('wishlist')
}
