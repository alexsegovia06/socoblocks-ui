import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight, ClipboardCheck, DollarSign, MessageSquareWarning, Users } from "lucide-react";
import { useCatalogo } from "../../../catalogo/useCatalogo.ts";
import { useEstadoSets } from "../../../catalogo/useEstadoSets.ts";
import ActionCard from "../../../components/ActionCard/ActionCard.tsx";
import OrderStatus from "../../../components/OrderStatus/OrderStatus.tsx";
import StatCard from "../../../components/StatCard/StatCard.tsx";
import StockAlert from "../../../components/StockAlert/StockAlert.tsx";
import { formatoPrecio } from "../../../data/sets.ts";
import { formatoFecha, leerTodosLosPedidos } from "../../../pedidos/pedidos.ts";
import { leerUsuariosConocidos } from "../../../usuarios/registro.ts";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { sets } = useCatalogo();
  const { estaActivo } = useEstadoSets();
  const pedidos = useMemo(() => leerTodosLosPedidos(), []);
  const usuarios = useMemo(() => leerUsuariosConocidos(), []);

  const ventas = pedidos.reduce((suma, p) => suma + p.total, 0);
  const pendientes = pedidos.filter((p) => p.estado === "PENDIENTE").length;
  const porAprobar = sets.filter((s) => !estaActivo(s)).length;
  const coleccionistas = usuarios.filter((u) => u.role === "COLECCIONISTA").length;
  const vendedores = usuarios.filter((u) => u.role === "VENDEDOR").length;

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <h1>Panel de Administración</h1>
        <p>Vista general de la tienda: usuarios, ventas y lo que espera tu revisión</p>
      </header>

      <section className="admin-dashboard__stats">
        <StatCard
          label="Usuarios"
          value={String(usuarios.length)}
          unit={usuarios.length === 1 ? "cuenta" : "cuentas"}
          tone="slate"
          icon={<Users size={28} />}
          footer={`${coleccionistas} coleccionistas · ${vendedores} vendedores`}
        />
        <StatCard
          label="Ventas totales"
          value={formatoPrecio(ventas)}
          unit="MXN"
          tone="green"
          icon={<DollarSign size={30} />}
          footer={`${pedidos.length} pedidos · ${pendientes} por despachar`}
        />
        <StatCard
          label="Sets por aprobar"
          value={String(porAprobar)}
          unit={porAprobar === 1 ? "set" : "sets"}
          tone="amber"
          icon={<ClipboardCheck size={28} />}
          footer={porAprobar > 0 ? "Esperan tu revisión" : "Todo el catálogo revisado"}
        />
      </section>

      <StockAlert />

      <section className="admin-dashboard__actions">
        <ActionCard
          title="Usuarios y roles"
          description="Consulta las cuentas de la tienda, sus compras y cambia el rol de cada una."
          tone="slate"
          icon={<Users size={28} />}
          to="/admin/users"
        />
        <ActionCard
          title="Aprobación de sets"
          description="Aprueba los sets pendientes para publicarlos o retira los que no cumplan."
          tone="red"
          icon={<ClipboardCheck size={28} />}
          to="/admin/sets"
        />
        <ActionCard
          title="Moderación de reseñas"
          description="Oculta las reseñas que no respeten las reglas de la comunidad."
          tone="slate"
          icon={<MessageSquareWarning size={28} />}
          to="/admin/reviews"
        />
      </section>

      <section className="admin-dashboard__pedidos" aria-labelledby="admin-pedidos-titulo">
        <h2 id="admin-pedidos-titulo">Pedidos recientes</h2>
        {pedidos.length === 0 ? (
          <p className="admin-dashboard__vacio">Todavía no hay pedidos en la tienda.</p>
        ) : (
          <ul>
            {pedidos.slice(0, 5).map((p) => (
              <li key={`${p.cliente}-${p.folio}`}>
                <div>
                  <strong>{p.folio}</strong>
                  <small>
                    {formatoFecha(p.fecha)} · {p.cliente}
                  </small>
                </div>
                <strong>{formatoPrecio(p.total)} MXN</strong>
                <OrderStatus estado={p.estado} />
              </li>
            ))}
          </ul>
        )}
        <Link to="/admin/users" className="admin-dashboard__ver">
          Ver compras por usuario
          <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
}
