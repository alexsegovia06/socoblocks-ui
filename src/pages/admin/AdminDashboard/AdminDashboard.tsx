import { Clock, DollarSign, Package, TrendingUp, Truck } from "lucide-react";
import StatCard from "../../../components/StatCard/StatCard.tsx";
import StockAlert from "../../../components/StockAlert/StockAlert.tsx";
import ActionCard from "../../../components/ActionCard/ActionCard.tsx";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <h1>Panel de Control del Vendedor</h1>
        <p>Monitoreo de ingresos, inventario y rendimiento de tus MOCs</p>
      </header>

      <section className="admin-dashboard__stats">
        <StatCard
          label="Ingresos del mes"
          value="$24,890"
          unit="MXN"
          tone="green"
          icon={<DollarSign size={30} />}
          footer={
            <span className="admin-dashboard__trend">
              <TrendingUp size={16} />
              +18.4% vs mes anterior
            </span>
          }
        />
        <StatCard
          label="Sets activos"
          value="4"
          unit="diseños"
          tone="slate"
          icon={<Package size={28} />}
          footer="1 pendiente de aprobación"
        />
        <StatCard
          label="Órdenes pendientes"
          value="1"
          unit="envío(s) por despachar"
          tone="amber"
          icon={<Clock size={28} />}
          footer="Tiempo prom: 1.2 días"
        />
      </section>

      <StockAlert />

      <section className="admin-dashboard__actions">
        <ActionCard
          title="Gestión de Catálogo"
          description="Agrega nuevos modelos, ajusta precios y actualiza piezas por set."
          tone="red"
          icon={<Package size={28} />}
        />
        <ActionCard
          title="Órdenes Recibidas"
          description="Consulta los pedidos de clientes, actualiza guías y despachos en tiempo real."
          tone="slate"
          icon={<Truck size={28} />}
        />
      </section>
    </div>
  );
}
