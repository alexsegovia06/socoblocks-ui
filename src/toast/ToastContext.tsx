import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import './Toast.css'

// Avisos breves que aparecen abajo a la derecha y se van solos.
// Uso: const toast = useToast(); toast.exito('Guardado'); toast.info('...', { accion: { texto, onClick } })

type Tipo = 'exito' | 'error' | 'info'

interface Accion {
  texto: string
  onClick: () => void
}

interface Opciones {
  accion?: Accion
}

interface Toast {
  id: number
  tipo: Tipo
  mensaje: string
  accion?: Accion
}

interface ToastValue {
  exito: (mensaje: string, opciones?: Opciones) => void
  error: (mensaje: string, opciones?: Opciones) => void
  info: (mensaje: string, opciones?: Opciones) => void
}

const ToastContext = createContext<ToastValue | null>(null)

// Máximo de avisos a la vez: si llega uno más, se va el más viejo
const MAXIMO = 3
// Con un botón (p. ej. "Deshacer") se da más tiempo para alcanzar a usarlo
const DURACION = 4000
const DURACION_CON_ACCION = 6500

const ICONOS = { exito: CheckCircle2, error: AlertTriangle, info: Info }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const siguienteId = useRef(0)

  const cerrar = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const mostrar = useCallback((tipo: Tipo, mensaje: string, opciones: Opciones = {}) => {
    const id = ++siguienteId.current
    setToasts((prev) => [...prev, { id, tipo, mensaje, accion: opciones.accion }].slice(-MAXIMO))
  }, [])

  const value = useMemo<ToastValue>(
    () => ({
      exito: (m, o) => mostrar('exito', m, o),
      error: (m, o) => mostrar('error', m, o),
      info: (m, o) => mostrar('info', m, o),
    }),
    [mostrar],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* La región existe siempre para que los lectores de pantalla anuncien cada aviso nuevo */}
      <div className="toasts" role="region" aria-label="Notificaciones" aria-live="polite">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onCerrar={cerrar} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// onCerrar es estable (useCallback): así el temporizador no se reinicia cuando llegan otros avisos
function ToastItem({ toast, onCerrar }: { toast: Toast; onCerrar: (id: number) => void }) {
  // Mientras el mouse o el foco estén encima, no se cierra
  const [pausado, setPausado] = useState(false)
  const Icono = ICONOS[toast.tipo]

  useEffect(() => {
    if (pausado) return
    const timer = setTimeout(() => onCerrar(toast.id), toast.accion ? DURACION_CON_ACCION : DURACION)
    return () => clearTimeout(timer)
  }, [pausado, toast.id, toast.accion, onCerrar])

  return (
    <div
      className={`toast toast--${toast.tipo}`}
      // Los errores se anuncian de inmediato; el resto lo anuncia la región "polite"
      role={toast.tipo === 'error' ? 'alert' : undefined}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <Icono size={20} className="toast__icono" />
      <p className="toast__mensaje">{toast.mensaje}</p>
      {toast.accion && (
        <button
          type="button"
          className="toast__accion"
          onClick={() => {
            toast.accion?.onClick()
            onCerrar(toast.id)
          }}
        >
          {toast.accion.texto}
        </button>
      )}
      <button type="button" className="toast__cerrar" aria-label="Cerrar aviso" onClick={() => onCerrar(toast.id)}>
        <X size={16} />
      </button>
    </div>
  )
}

export function useToast() {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return value
}
