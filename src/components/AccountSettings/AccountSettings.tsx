import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { KeyRound, Save, UserRound } from "lucide-react";
import { ApiError } from "../../api.ts";
import { useAuth } from "../../auth/AuthContext.tsx";
import "./AccountSettings.css";

// Ajustes de cuenta que son iguales para cualquier rol (usuario, vendedor, admin).
// Cada página de ajustes lo usa y, si hace falta, agrega debajo sus propias secciones.

const EMPTY_FORM = { currentPassword: "", newPassword: "", confirmPassword: "" };
type PasswordForm = typeof EMPTY_FORM;
type FieldName = keyof PasswordForm;

function validate(form: PasswordForm): Partial<Record<FieldName, string>> {
  const problems: Partial<Record<FieldName, string>> = {};
  if (form.newPassword === form.currentPassword) {
    problems.newPassword = "La nueva contraseña debe ser distinta a la actual.";
  }
  if (form.confirmPassword !== form.newPassword) {
    problems.confirmPassword = "Las contraseñas no coinciden.";
  }
  return problems;
}

interface PasswordFieldProps {
  label: string;
  name: FieldName;
  value: string;
  autoComplete: string;
  error?: string;
  minLength?: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function PasswordField({ label, name, error, minLength, ...input }: PasswordFieldProps) {
  const id = useId();
  return (
    <div className="settings__field">
      <label className="settings__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="settings__input"
        type="password"
        name={name}
        minLength={minLength}
        maxLength={72} // mismo límite que el registro (bcrypt corta en 72 bytes)
        aria-invalid={error ? true : undefined}
        required
        {...input}
      />
      {error && <small className="settings__error">{error}</small>}
    </div>
  );
}

export default function AccountSettings() {
  const { user, authFetch } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) return null; // las rutas ya exigen sesión; esto solo satisface a TypeScript

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);

    const problems = validate(form);
    setFieldErrors(problems);
    if (Object.keys(problems).length > 0) return;

    setLoading(true);
    try {
      await authFetch<null>("/api/user/password", {
        method: "PUT",
        body: {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
      });
      setForm(EMPTY_FORM);
      setSaved(true);
    } catch (err) {
      // Si el backend devuelve errores por campo ({ errors: { newPassword: "..." } }) los pintamos en su input
      const fromServer = err instanceof ApiError ? err.errors : {};
      if (Object.keys(fromServer).some((key) => key in EMPTY_FORM)) {
        setFieldErrors(fromServer);
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  }

  const bind = (name: FieldName) => ({
    name,
    value: form[name],
    error: fieldErrors[name],
    onChange: handleChange,
  });

  return (
    <div className="settings">
      <section className="settings__card">
        <header className="settings__head">
          <UserRound size={18} />
          <h2>Cuenta</h2>
        </header>
        <div className="settings__field">
          <label className="settings__label" htmlFor="settings-username">
            Usuario
          </label>
          {/* Solo lectura: el username es la identidad dentro del token (JWT), cambiarlo rompería la sesión */}
          <input
            id="settings-username"
            className="settings__input"
            value={user.username}
            readOnly
          />
        </div>
      </section>

      <section className="settings__card">
        <header className="settings__head">
          <KeyRound size={18} />
          <h2>Cambiar contraseña</h2>
        </header>

        <form className="settings__form" onSubmit={handleSubmit}>
          <PasswordField
            label="Contraseña actual"
            autoComplete="current-password"
            {...bind("currentPassword")}
          />
          <PasswordField
            label="Nueva contraseña"
            autoComplete="new-password"
            minLength={8}
            {...bind("newPassword")}
          />
          <PasswordField
            label="Confirmar nueva contraseña"
            autoComplete="new-password"
            {...bind("confirmPassword")}
          />

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {saved && (
            <p className="settings__ok" role="status">
              Contraseña actualizada correctamente.
            </p>
          )}

          <button className="settings__submit" disabled={loading}>
            {loading ? "Guardando…" : "Guardar cambios"}
            {!loading && <Save size={16} />}
          </button>
        </form>
      </section>
    </div>
  );
}
