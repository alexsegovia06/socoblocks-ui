import { useEffect, useState } from "react";
import { CalendarClock, ShieldCheck } from "lucide-react";
import { useAuth } from "../../auth/AuthContext.tsx";
import type { MeResponse, Role } from "../../types.ts";
import "./Profile.css";

// Cómo se muestra cada rol en pantalla
const ROLE_LABEL: Record<Role, string> = {
  COLECCIONISTA: "Coleccionista",
  VENDEDOR: "Vendedor",
  ADMIN: "Administrador",
};

// Fecha legible; si el backend manda un formato raro, no mostramos nada en vez de "Invalid Date"
function formatDate(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("es-MX", { dateStyle: "long", timeStyle: "short" });
}

export default function Profile() {
  const { authFetch } = useAuth();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch<MeResponse>("/api/user/me")
      .then(setMe)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!me) return <p className="muted">Cargando...</p>;

  const expires = formatDate(me.expiresAt);

  return (
    <section className="profile">
      <div className="profile__top">
        {/* Avatar generado con la inicial; cuando haya foto en el backend se cambia por un <img> */}
        <div className="profile__avatar" aria-hidden="true">
          {me.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile__identity">
          <h2 className="profile__name">{me.username}</h2>
          <span className="profile__role">
            <ShieldCheck size={14} />
            {ROLE_LABEL[me.role] ?? me.role}
          </span>
        </div>
      </div>

      <dl className="profile__details">
        <div className="profile__detail">
          <dt>Usuario</dt>
          <dd>{me.username}</dd>
        </div>
        <div className="profile__detail">
          <dt>Tipo de cuenta</dt>
          <dd>{ROLE_LABEL[me.role] ?? me.role}</dd>
        </div>
        {expires && (
          <div className="profile__detail">
            <dt>
              <CalendarClock size={13} /> Sesión vigente hasta
            </dt>
            <dd>{expires}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
