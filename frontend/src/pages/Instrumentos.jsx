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
import StatusBadge from "../components/StatusBadge.jsx";
import { useApi } from "../hooks/useApi";
import api from "../services/api";
import { normalizeText } from "../utils/formatters";

function badgeVariant(estado) {
  if (estado === "ok") return "ok";
  if (estado === "reparado") return "credit";
  if (estado === "danificado") return "danger";
  return "default";
}

const emptyForm = {
  estado: "ok",
  info: "",
  membro_id: "",
  modelo: "",
  nome: ""
};

export default function Instrumentos() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { data, error, loading, reload } = useApi(async () => {
    const [instrumentos, membros] = await Promise.all([api.get("/instrumentos"), api.get("/membros")]);
    const withOwners = await Promise.all(
      instrumentos.data.map(async (instrumento) => {
        const owners = await api.get(`/instrumentos/${instrumento.id}/membros`);
        return {
          ...instrumento,
          owners: owners.data,
          proprietario: owners.data.map((membro) => membro.nome).join(", ") || "-"
        };
      })
    );

    return { instrumentos: withOwners, membros: membros.data };
  }, []);

  const instrumentos = data.instrumentos || [];
  const membros = data.membros || [];

  const filtered = useMemo(() => {
    const term = normalizeText(search);
    return instrumentos.filter((item) =>
      [item.nome, item.modelo, item.estado, item.proprietario].some((value) => normalizeText(value).includes(term))
    );
  }, [instrumentos, search]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(instrumento) {
    setEditing(instrumento);
    setForm({
      estado: instrumento.estado || "ok",
      info: instrumento.info || "",
      membro_id: instrumento.owners?.[0]?.id || "",
      modelo: instrumento.modelo || "",
      nome: instrumento.nome || ""
    });
    setModalOpen(true);
  }

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      estado: form.estado,
      info: form.info,
      modelo: form.modelo,
      nome: form.nome
    };

    const response = editing ? await api.put(`/instrumentos/${editing.id}`, payload) : await api.post("/instrumentos", payload);
    const instrumentoId = editing?.id || response.data.id;

    if (form.membro_id) {
      await api.post(`/instrumentos/${instrumentoId}/membros`, { membro_id: form.membro_id });
    }

    setModalOpen(false);
    await reload();
  }

  async function handleRemove(instrumento) {
    if (!confirm(`Remover ${instrumento.nome}?`)) return;
    await api.delete(`/instrumentos/${instrumento.id}`);
    await reload();
  }

  return (
    <>
      <PageHeader
        action={<ActionButton icon={Plus} onClick={openCreate}>Adicionar instrumento</ActionButton>}
        description="Visualize instrumentos, modelos, estado de conservacao e proprietarios."
        title="Instrumentos"
      />
      <ErrorState message={error} />

      <div className="mb-4">
        <SearchInput onChange={setSearch} placeholder="Buscar instrumento, modelo, estado ou proprietario" value={search} />
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <DataTable
          columns={[
            { header: "Nome", key: "nome" },
            { header: "Modelo", key: "modelo" },
            {
              header: "Estado",
              key: "estado",
              render: (row) => <StatusBadge variant={badgeVariant(row.estado)}>{row.estado}</StatusBadge>
            },
            { header: "Proprietario", key: "proprietario" },
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
        title={editing ? "Editar instrumento" : "Adicionar instrumento"}
      >
        <FormField label="Nome" name="nome" onChange={handleChange} value={form.nome} />
        <FormField label="Modelo" name="modelo" onChange={handleChange} value={form.modelo} />
        <FormField
          label="Estado"
          name="estado"
          onChange={handleChange}
          options={[
            { label: "Ok", value: "ok" },
            { label: "Reparado", value: "reparado" },
            { label: "Danificado", value: "danificado" }
          ]}
          value={form.estado}
        />
        <FormField
          label="Proprietario"
          name="membro_id"
          onChange={handleChange}
          options={membros.map((membro) => ({ label: membro.nome, value: membro.id }))}
          value={form.membro_id}
        />
        <FormField label="Informacoes" name="info" onChange={handleChange} value={form.info} />
      </FormModal>
    </>
  );
}
