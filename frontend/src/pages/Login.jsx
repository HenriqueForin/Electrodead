import { Music2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ActionButton from "../components/ActionButton.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ login: "", senha: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      await login(form);
      navigate("/", { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Nao foi possivel entrar no sistema.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-soft" onSubmit={handleSubmit}>
        <div className="mb-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-500/15 text-accent-500 ring-1 ring-accent-500/30">
            <Music2 className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-500">Electrodead</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Entrar no painel</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Acesse o gerenciamento da banda usando seu usuario cadastrado.</p>
        </div>

        <ErrorState message={error} />

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            Usuario
            <input
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-accent-500/60"
              name="login"
              onChange={handleChange}
              placeholder="admin"
              value={form.login}
            />
          </label>
          <label className="block text-sm font-medium text-slate-300">
            Senha
            <input
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-accent-500/60"
              name="senha"
              onChange={handleChange}
              placeholder="Sua senha"
              type="password"
              value={form.senha}
            />
          </label>
        </div>

        <div className="mt-6">
          <ActionButton type="submit">{loading ? "Entrando..." : "Entrar"}</ActionButton>
        </div>
      </form>
    </main>
  );
}
