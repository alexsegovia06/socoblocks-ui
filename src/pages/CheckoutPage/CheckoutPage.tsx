import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router'
import { ArrowLeft, Banknote, CheckCircle2, CreditCard, Landmark, Lock } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext.tsx'
import { useCarrito } from '../../carrito/CarritoContext.tsx'
import { useLineasCarrito } from '../../carrito/useLineasCarrito.ts'
import { formatoPrecio } from '../../data/sets.ts'
import { crearPedido } from '../../pedidos/pedidos.ts'
import { useToast } from '../../toast/ToastContext.tsx'
import type { DatosEnvio, MetodoPago, Pedido } from '../../pedidos/pedidos.ts'
import '../CartPage/CartPage.css'
import './CheckoutPage.css'

const ENVIO_VACIO: DatosEnvio = { nombre: '', telefono: '', calle: '', colonia: '', ciudad: '', estado: '', cp: '' }

const METODOS: { id: MetodoPago; titulo: string; detalle: string; icono: typeof CreditCard }[] = [
  { id: 'tarjeta', titulo: 'Tarjeta al recibir', detalle: 'Pagas con terminal cuando llega tu pedido', icono: CreditCard },
  { id: 'transferencia', titulo: 'Transferencia', detalle: 'Te enviamos la CLABE al confirmar', icono: Landmark },
  { id: 'oxxo', titulo: 'Pago en OXXO', detalle: 'Recibes una referencia para pagar en tienda', icono: Banknote },
]

// Campos del formulario de envío: etiqueta, autocompletado y validación del navegador
const CAMPOS: {
  name: keyof DatosEnvio
  label: string
  autoComplete: string
  ancho?: boolean
  pattern?: string
  inputMode?: 'numeric' | 'tel'
  title?: string
}[] = [
  { name: 'nombre', label: 'Nombre completo', autoComplete: 'name', ancho: true },
  { name: 'telefono', label: 'Teléfono', autoComplete: 'tel', inputMode: 'tel', pattern: '[0-9 ]{10,14}', title: '10 dígitos' },
  { name: 'cp', label: 'Código postal', autoComplete: 'postal-code', inputMode: 'numeric', pattern: '[0-9]{5}', title: '5 dígitos' },
  { name: 'calle', label: 'Calle y número', autoComplete: 'address-line1', ancho: true },
  { name: 'colonia', label: 'Colonia', autoComplete: 'address-line2' },
  { name: 'ciudad', label: 'Ciudad o municipio', autoComplete: 'address-level2' },
  { name: 'estado', label: 'Estado', autoComplete: 'address-level1', ancho: true },
]

export default function CheckoutPage() {
  const { user } = useAuth()
  const { vaciar } = useCarrito()
  const toast = useToast()
  const { lineas, subtotal, puedePagar, cargando } = useLineasCarrito()
  const [envio, setEnvio] = useState<DatosEnvio>(ENVIO_VACIO)
  const [metodo, setMetodo] = useState<MetodoPago>('tarjeta')
  const [confirmado, setConfirmado] = useState<Pedido | null>(null)

  if (confirmado) {
    return (
      <main className="carrito-pagina">
        <section className="checkout__exito" aria-live="polite">
          <CheckCircle2 size={56} />
          <h1>¡Pedido confirmado!</h1>
          <p>
            Tu folio es <strong>{confirmado.folio}</strong>. Te avisaremos cuando tu pedido salga a{' '}
            {confirmado.envio.ciudad}.
          </p>
          <p className="checkout__exito-total">
            Total: <strong>{formatoPrecio(confirmado.total)} MXN</strong> ·{' '}
            {METODOS.find((m) => m.id === confirmado.metodoPago)?.titulo}
          </p>
          <Link to="/" className="carrito-pagina__boton checkout__exito-boton">
            Volver al catálogo
          </Link>
        </section>
      </main>
    )
  }

  if (cargando) {
    return (
      <main className="carrito-pagina">
        <p className="muted">Cargando tu pedido…</p>
      </main>
    )
  }

  // Sin productos (o con stock insuficiente) no hay nada que pagar: de regreso al carrito
  if (!puedePagar) return <Navigate to="/cart" replace />

  function cambiar(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setEnvio((prev) => ({ ...prev, [name]: value }))
  }

  function confirmar(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    const pedido = crearPedido(user.username, {
      lineas: lineas.map(({ set, cantidad }) => ({
        setId: set.id,
        nombre: set.nombre,
        precio: set.precio,
        cantidad,
        imagen: set.imagen,
      })),
      total: subtotal,
      envio: { ...envio, nombre: envio.nombre.trim() },
      metodoPago: metodo,
    })
    setConfirmado(pedido)
    vaciar()
    toast.exito(`Pedido ${pedido.folio} confirmado.`)
  }

  return (
    <main className="carrito-pagina">
      <header className="carrito-pagina__head">
        <div>
          <h1>Finalizar compra</h1>
          <p>Revisa tus datos de envío y elige cómo pagar</p>
        </div>
        <Link to="/cart" className="carrito-pagina__seguir">
          <ArrowLeft size={16} />
          Volver al carrito
        </Link>
      </header>

      <form className="carrito-pagina__cuerpo" onSubmit={confirmar}>
        <div className="checkout__columna">
          <fieldset className="carrito-pagina__card checkout__seccion">
            <legend>Datos de envío</legend>
            <div className="checkout__campos">
              {CAMPOS.map((c) => (
                <label key={c.name} className={`checkout__campo${c.ancho ? ' checkout__campo--ancho' : ''}`}>
                  {c.label}
                  <input
                    name={c.name}
                    value={envio[c.name]}
                    onChange={cambiar}
                    autoComplete={c.autoComplete}
                    inputMode={c.inputMode}
                    pattern={c.pattern}
                    title={c.title}
                    required
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="carrito-pagina__card checkout__seccion">
            <legend>Método de pago</legend>
            <div className="checkout__metodos">
              {METODOS.map(({ id, titulo, detalle, icono: Icono }) => (
                <label key={id} className={`checkout__metodo${metodo === id ? ' checkout__metodo--activo' : ''}`}>
                  <input
                    type="radio"
                    name="metodo"
                    value={id}
                    checked={metodo === id}
                    onChange={() => setMetodo(id)}
                  />
                  <Icono size={22} />
                  <span>
                    <strong>{titulo}</strong>
                    <small>{detalle}</small>
                  </span>
                </label>
              ))}
            </div>
            <p className="checkout__simulado">
              <Lock size={14} />
              Pago simulado: todavía no hay pasarela de pago, no se cobra nada.
            </p>
          </fieldset>
        </div>

        <aside className="carrito-pagina__card carrito-pagina__resumen" aria-labelledby="checkout-resumen">
          <h2 id="checkout-resumen">Tu pedido</h2>
          <ul className="checkout__items">
            {lineas.map(({ set, cantidad }) => (
              <li key={set.id}>
                <span>
                  {set.nombre} <small>× {cantidad}</small>
                </span>
                <strong>{formatoPrecio(set.precio * cantidad)}</strong>
              </li>
            ))}
          </ul>
          <dl>
            <div>
              <dt>Envío</dt>
              <dd className="carrito-pagina__gratis">Gratis</dd>
            </div>
            <div className="carrito-pagina__total">
              <dt>Total</dt>
              <dd>{formatoPrecio(subtotal)} MXN</dd>
            </div>
          </dl>
          <button type="submit" className="carrito-pagina__boton">
            Confirmar pedido
          </button>
        </aside>
      </form>
    </main>
  )
}
