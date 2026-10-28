import Coleccion from "../../../components/Coleccion/Coleccion.tsx";
import Profile from "../../../components/Profile/Profile.tsx";
import Wishlist from "../../../components/Wishlist/Wishlist.tsx";

export default function UserProfile() {
  return (
    <>
      <h1>Perfil</h1>
      <Profile />
      <Coleccion />
      <Wishlist />
    </>
  );
}
