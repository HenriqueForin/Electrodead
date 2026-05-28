import { Edit, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import ActionButton from "../components/ActionButton.jsx";
import DataTable from "../components/DataTable.jsx";
import ErrorState from "../components/ErrorState.jsx";
import FormField from "../components/FormField.jsx";
import FormModal from "../components/FormModal.jsx";
import LoadingState from "../components/LoadingState.jsx";
import PageHeader from "../components/PageHeader.jsx";
import SearchInput from "../components/SearchInput.jsx";
import { useApi } from "../hooks/useApi";
import api from "../services/api";
import { formatCurrency, formatDate, normalizeText } from "../utils/formatters";

const emptyForm = {
  data: "",
  local: "",
  titulo: "",
  valor_recebido: ""
};

export default function Eventos() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, error, loading, reload } = useApi(async () => {
    const response = await api.get("/eventos");
    return response.data;
  }, []);

  const filtered = useMemo(() => {
    const term = normalizeText(search);
    return data.filter((evento) => [evento.titulo, evento.local, evento.valor_recebido].some((value) => normalizeText(value).includes(term)));
  }, [data, search]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(evento) {
    setEditing(evento);
    setForm({
      data: evento.data?.slice(0, 10) || "",
      local: evento.local || "",
      titulo: evento.titulo || "",
      valor_recebido: evento.valor_recebido || ""
    });
    setModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (editing) {
      await api.put(`/eventos/${editing.id}`, form);
    } else {
      await api.post("/eventos", form);
    }

    setForm(emptyForm);
    setModalOpen(false);
    await reload();
  }

  async function handleRemove(evento) {
    if (!confirm(`Remover ${evento.titulo}?`)) return;
    await api.delete(`/eventos/${evento.id}`);
    await reload();
  }

  return (
    <>
      <PageHeader
        action={<ActionButton icon={Plus} onClick={openCreate}>Adicionar evento</ActionButton>}
        description="Organize shows, ensaios especiais e demais compromissos da banda."
        title="Eventos"
      />
      <ErrorState message={error} />

      <div className="mb-4">
        <SearchInput onChange={setSearch} placeholder="Buscar por titulo, local ou valor" value={search} />
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <DataTable
          columns={[
            { header: "Titulo", key: "titulo" },
            { header: "Data", key: "data", render: (row) => formatDate(row.data) },
            { header: "Local", key: "local" },
            { header: "Valor recebido", key: "valor_recebido", render: (row) => formatCurrency(row.valor_recebido) },
            {
              header: "Acoes",
              key: "actions",
              render: (row) => (
                <div className="flex gap-2">
                  <ActionButton icon={Edit} onClick={() => openEdit(row)} variant="ghost">Editar</ActionButton>
                  <ActionButton icon={Trash2} onClick={() => handleRemove(row)} variant="danger">Remover</ActionButton>
                </div>
              )
            }
          ]}
          data={filtered}
        />
      )}

      <FormModal
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        open={modalOpen}
        submitLabel={editing ? "Atualizar" : "Adicionar"}
        title={editing ? "Editar evento" : "Adicionar evento"}
      >
        <FormField label="Titulo" name="titulo" onChange={handleChange} value={form.titulo} />
        <FormField label="Data" name="data" onChange={handleChange} type="date" value={form.data} />
        <FormField label="Local" name="local" onChange={handleChange} value={form.local} />
        <FormField label="Valor recebido" name="valor_recebido" onChange={handleChange} type="number" value={form.valor_recebido} />
      </FormModal>
    </>
  );
}
