import { useMemo } from "react";
import { Clock, DollarSign, Package, TrendingDown, TrendingUp, Truck } from "lucide-react";
import { useCatalogo } from "../../../catalogo/useCatalogo.ts";
import { useEstadoSets } from "../../../catalogo/useEstadoSets.ts";
import StatCard from "../../../components/StatCard/StatCard.tsx";
import StockAlert from "../../../components/StockAlert/StockAlert.tsx";
import ActionCard from "../../../components/ActionCard/ActionCard.tsx";
import { formatoPrecio } from "../../../data/sets.ts";
import { leerTodosLosPedidos } from "../../../pedidos/pedidos.ts";
import "./SellerDashboard.css";

// Suma de los pedidos de un mes (0 = este mes, -1 = el anterior)
function ingresosDelMes(pedidos: { fecha: string; total: number }[], desplazamiento: number) {
  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth() + desplazamiento, 1);
  const fin = new Date(hoy.getFullYear(), hoy.getMonth() + desplazamiento + 1, 1);
  return pedidos
    .filter((p) => {
      const fecha = new Date(p.fecha);
      return fecha >= inicio && fecha < fin;
    })
    .reduce((suma, p) => suma + p.total, 0);
}

export default function SellerDashboard() {
  const { sets } = useCatalogo();
  const { estaActivo } = useEstadoSets();
  // TODO: con el endpoint de pedidos, solo los de los sets de este vendedor
  const pedidos = useMemo(() => leerTodosLosPedidos(), []);

  const esteMes = ingresosDelMes(pedidos, 0);
  const mesPasado = ingresosDelMes(pedidos, -1);
  const variacion = mesPasado > 0 ? Math.round(((esteMes - mesPasado) / mesPasado) * 1000) / 10 : null;

  const activos = sets.filter(estaActivo).length;
  const pendientes = pedidos.filter((p) => p.estado === "PENDIENTE").length;
  const enCamino = pedidos.filter((p) => p.estado === "ENVIADO").length;

  return (
    <div className="seller-dashboard">
      <header className="seller-dashboard__header">
        <h1>Panel de Control del Vendedor</h1>
        <p>Monitoreo de ingresos, inventario y rendimiento de tus MOCs</p>
      </header>

      <section className="seller-dashboard__stats">
        <StatCard
          label="Ingresos del mes"
          value={formatoPrecio(esteMes)}
          unit="MXN"
          tone="green"
          icon={<DollarSign size={30} />}
          footer={
            variacion === null ? (
              "Sin ventas el mes anterior"
            ) : (
              <span
                className={`seller-dashboard__trend${variacion < 0 ? " seller-dashboard__trend--baja" : ""}`}
              >
                {variacion < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                {variacion > 0 ? "+" : ""}
                {variacion}% vs mes anterior
              </span>
            )
          }
        />
        <StatCard
          label="Sets activos"
          value={String(activos)}
          unit={activos === 1 ? "diseño" : "diseños"}
          tone="slate"
          icon={<Package size={28} />}
          footer={sets.length - activos > 0 ? `${sets.length - activos} ocultos del catálogo` : "Todos publicados"}
        />
        <StatCard
          label="Órdenes pendientes"
          value={String(pendientes)}
          unit="envío(s) por despachar"
          tone="amber"
          icon={<Clock size={28} />}
          footer={`${enCamino} en camino`}
        />
      </section>

      <StockAlert to="/seller/products?stock=bajo" />

      <section className="seller-dashboard__actions">
        <ActionCard
          title="Gestión de Catálogo"
          description="Busca tus sets, revisa su stock y publícalos u ocúltalos de la tienda."
          tone="red"
          icon={<Package size={28} />}
          to="/seller/products"
        />
        <ActionCard
          title="Órdenes Recibidas"
          description="Consulta los pedidos de clientes y actualiza en qué va cada envío."
          tone="slate"
          icon={<Truck size={28} />}
          to="/seller/orders"
        />
      </section>
    </div>
  );
}
