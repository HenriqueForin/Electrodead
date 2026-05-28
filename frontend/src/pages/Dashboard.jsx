import { CalendarDays, DollarSign, Guitar, Ticket, Users } from "lucide-react";

import DataTable from "../components/DataTable.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import { useApi } from "../hooks/useApi";
import api from "../services/api";
import { formatCurrency, formatDate } from "../utils/formatters";

export default function Dashboard() {
  const { data, error, loading } = useApi(async () => {
    const [dashboard, eventos, financeiro] = await Promise.all([
      api.get("/dashboard/resumo"),
      api.get("/eventos"),
      api.get("/orcamentos/resumo")
    ]);

    return {
      dashboard: dashboard.data,
      eventos: eventos.data,
      financeiro: financeiro.data
    };
  }, []);

  const proximosEventos = (data.eventos || [])
    .filter((evento) => new Date(evento.data) >= new Date(new Date().toDateString()))
    .slice(0, 5);

  return (
    <>
      <PageHeader description="Acompanhe os principais indicadores da banda em tempo real." title="Dashboard" />
      <ErrorState message={error} />

      {loading ? (
        <LoadingState />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Users} label="Membros" tone="sky" value={data.dashboard?.membros || 0} />
            <StatCard icon={Guitar} label="Instrumentos" tone="violet" value={data.dashboard?.instrumentos || 0} />
            <StatCard icon={CalendarDays} label="Eventos" tone="cyan" value={data.dashboard?.eventos || 0} />
            <StatCard icon={DollarSign} label="Saldo financeiro" tone="emerald" value={formatCurrency(data.financeiro?.saldo)} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <section>
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-accent-500" />
                <h2 className="text-lg font-semibold text-white">Proximos eventos</h2>
              </div>
              <DataTable
                columns={[
                  { header: "Titulo", key: "titulo" },
                  { header: "Data", key: "data", render: (row) => formatDate(row.data) },
                  { header: "Local", key: "local" },
                  { header: "Valor recebido", key: "valor_recebido", render: (row) => formatCurrency(row.valor_recebido) }
                ]}
                data={proximosEventos}
                emptyMessage="Nenhum evento futuro cadastrado."
              />
            </section>

            <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-soft">
              <div className="mb-5 flex items-center gap-2">
                <Ticket className="h-5 w-5 text-accent-500" />
                <h2 className="text-lg font-semibold text-white">Ingressos</h2>
              </div>
              <dl className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <dt className="text-sm text-slate-400">Meta total</dt>
                  <dd className="text-lg font-semibold text-white">{data.dashboard?.ingressos?.meta_total || 0}</dd>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <dt className="text-sm text-slate-400">Vendidos</dt>
                  <dd className="text-lg font-semibold text-white">{data.dashboard?.ingressos?.vendidos || 0}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-400">Valor previsto</dt>
                  <dd className="text-lg font-semibold text-emerald-300">
                    {formatCurrency(data.dashboard?.ingressos?.valor_previsto)}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
