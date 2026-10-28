import Colection from "../../../components/Colection/Colection.tsx";
import Profile from "../../../components/Profile/Profile.tsx";
import Wishlist from "../../../components/Wishlist/Wishlist.tsx";

export default function UserProfile() {
  return (
    <>
      <h1>Perfil</h1>
      <Profile />
      <Colection />
      <Wishlist />
    </>
  );
}
