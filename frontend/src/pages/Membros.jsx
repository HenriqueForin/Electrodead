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
import { normalizeText } from "../utils/formatters";

const emptyForm = {
  cpf: "",
  data_nasc: "",
  endereco: "",
  funcao: "",
  nome: "",
  telefone: ""
};

export default function Membros() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, error, loading, reload } = useApi(async () => {
    const [membros, instrumentos] = await Promise.all([api.get("/membros"), api.get("/instrumentos")]);
    const instrumentosComMembros = await Promise.all(
      instrumentos.data.map(async (instrumento) => {
        const response = await api.get(`/instrumentos/${instrumento.id}/membros`);
        return { ...instrumento, membros: response.data };
      })
    );

    return membros.data.map((membro) => ({
      ...membro,
      instrumento:
        instrumentosComMembros
          .filter((instrumento) => instrumento.membros.some((item) => item.id === membro.id))
          .map((instrumento) => instrumento.nome)
          .join(", ") || "-"
    }));
  }, []);

  const filtered = useMemo(() => {
    const term = normalizeText(search);
    return data.filter((membro) =>
      [membro.nome, membro.funcao, membro.telefone, membro.instrumento].some((value) => normalizeText(value).includes(term))
    );
  }, [data, search]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(membro) {
    setEditing(membro);
    setForm({
      cpf: membro.cpf || "",
      data_nasc: membro.data_nasc?.slice(0, 10) || "",
      endereco: membro.endereco || "",
      funcao: membro.funcao || "",
      nome: membro.nome || "",
      telefone: membro.telefone || ""
    });
    setModalOpen(true);
  }

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (editing) {
      await api.put(`/membros/${editing.id}`, form);
    } else {
      await api.post("/membros", form);
    }

    setModalOpen(false);
    await reload();
  }

  async function handleRemove(membro) {
    if (!confirm(`Remover ${membro.nome}?`)) return;
    await api.delete(`/membros/${membro.id}`);
    await reload();
  }

  return (
    <>
      <PageHeader
        action={<ActionButton icon={Plus} onClick={openCreate}>Adicionar membro</ActionButton>}
        description="Gerencie os integrantes, funcoes, contatos e instrumentos relacionados."
        title="Membros"
      />
      <ErrorState message={error} />

      <div className="mb-4">
        <SearchInput onChange={setSearch} placeholder="Buscar por nome, funcao, telefone ou instrumento" value={search} />
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <DataTable
          columns={[
            { header: "Nome", key: "nome" },
            { header: "Funcao", key: "funcao" },
            { header: "Telefone", key: "telefone" },
            { header: "Instrumento", key: "instrumento" },
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
        title={editing ? "Editar membro" : "Adicionar membro"}
      >
        <FormField label="Nome" name="nome" onChange={handleChange} value={form.nome} />
        <FormField label="Funcao" name="funcao" onChange={handleChange} value={form.funcao} />
        <FormField label="Telefone" name="telefone" onChange={handleChange} value={form.telefone} />
        <FormField label="CPF" name="cpf" onChange={handleChange} value={form.cpf} />
        <FormField label="Data de nascimento" name="data_nasc" onChange={handleChange} type="date" value={form.data_nasc} />
        <FormField label="Endereco" name="endereco" onChange={handleChange} value={form.endereco} />
      </FormModal>
    </>
  );
}
