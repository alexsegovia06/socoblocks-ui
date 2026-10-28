import AccountSettings from "../../../components/AccountSettings/AccountSettings.tsx";

export default function UserSettings() {
  return (
    <>
      <h1>Ajustes</h1>
      <p className="muted">Administra tu cuenta y la seguridad de tu acceso.</p>
      <AccountSettings />
    </>
  );
}
