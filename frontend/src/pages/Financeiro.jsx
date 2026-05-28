import { ArrowDownCircle, ArrowUpCircle, DollarSign, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import ActionButton from "../components/ActionButton.jsx";
import DataTable from "../components/DataTable.jsx";
import ErrorState from "../components/ErrorState.jsx";
import FormField from "../components/FormField.jsx";
import FormModal from "../components/FormModal.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SearchInput from "../components/SearchInput.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useApi } from "../hooks/useApi";
import api from "../services/api";
import { formatCurrency, formatDate, normalizeText } from "../utils/formatters";

const emptyForm = {
  data: "",
  descricao: "",
  evento_id: "",
  quantia: "",
  tipo: "credito"
};

export default function Financeiro() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { data, error, loading, reload } = useApi(async () => {
    const [resumo, historico, eventos] = await Promise.all([api.get("/orcamentos/resumo"), api.get("/orcamentos"), api.get("/eventos")]);
    return {
      eventos: eventos.data,
      historico: historico.data,
      resumo: resumo.data
    };
  }, []);

  const filtered = useMemo(() => {
    const term = normalizeText(search);
    return (data.historico || []).filter((item) =>
      [item.tipo, item.descricao, item.quantia].some((value) => normalizeText(value).includes(term))
    );
  }, [data.historico, search]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await api.post("/orcamentos", {
      ...form,
      evento_id: form.evento_id || null
    });
    setForm(emptyForm);
    setModalOpen(false);
    await reload();
  }

  return (
    <>
      <PageHeader
        action={<ActionButton icon={Plus} onClick={() => setModalOpen(true)}>Novo lancamento</ActionButton>}
        description="Controle creditos, debitos, saldo e historico financeiro da banda."
        title="Financeiro"
      />
      <ErrorState message={error} />

      {loading ? (
        <LoadingState />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard icon={ArrowUpCircle} label="Creditos" tone="emerald" value={formatCurrency(data.resumo?.creditos)} />
            <StatCard icon={ArrowDownCircle} label="Debitos" tone="rose" value={formatCurrency(data.resumo?.debitos)} />
            <StatCard icon={DollarSign} label="Total arrecadado" tone="sky" value={formatCurrency(data.resumo?.saldo)} />
          </div>

          <div>
            <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <h2 className="text-lg font-semibold text-white">Historico financeiro</h2>
              <SearchInput onChange={setSearch} placeholder="Buscar lancamento" value={search} />
            </div>
            <DataTable
              columns={[
                { header: "Data", key: "data", render: (row) => formatDate(row.data) },
                {
                  header: "Tipo",
                  key: "tipo",
                  render: (row) => (
                    <StatusBadge variant={row.tipo === "credito" ? "credit" : "danger"}>
                      {row.tipo === "credito" ? "Credito" : "Debito"}
                    </StatusBadge>
                  )
                },
                { header: "Descricao", key: "descricao" },
                { header: "Quantia", key: "quantia", render: (row) => formatCurrency(row.quantia) }
              ]}
              data={filtered}
            />
          </div>
        </div>
      )}

      <FormModal onClose={() => setModalOpen(false)} onSubmit={handleSubmit} open={modalOpen} submitLabel="Adicionar" title="Novo lancamento">
        <FormField
          label="Tipo"
          name="tipo"
          onChange={handleChange}
          options={[
            { label: "Credito", value: "credito" },
            { label: "Debito", value: "debito" }
          ]}
          value={form.tipo}
        />
        <FormField label="Data" name="data" onChange={handleChange} type="date" value={form.data} />
        <FormField label="Descricao" name="descricao" onChange={handleChange} value={form.descricao} />
        <FormField label="Quantia" name="quantia" onChange={handleChange} type="number" value={form.quantia} />
        <FormField
          label="Evento"
          name="evento_id"
          onChange={handleChange}
          options={(data.eventos || []).map((evento) => ({ label: evento.titulo, value: evento.id }))}
          value={form.evento_id}
        />
      </FormModal>
    </>
  );
}
