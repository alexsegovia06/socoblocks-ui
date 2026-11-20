import AccountSettings from "../../../components/AccountSettings/AccountSettings.tsx";
import Profile from "../../../components/Profile/Profile.tsx";

export default function AdminSettings() {
  return (
    <>
      <h1>Ajustes</h1>
      <p className="muted">Tu cuenta de administrador y la seguridad de tu acceso.</p>
      <Profile />
      <AccountSettings />
    </>
  );
}
