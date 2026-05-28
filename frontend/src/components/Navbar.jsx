import { LogOut, Menu, Search } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.jsx";

const mobileNavigation = [
  { href: "/", label: "Dashboard" },
  { href: "/membros", label: "Membros" },
  { href: "/instrumentos", label: "Instrumentos" },
  { href: "/eventos", label: "Eventos" },
  { href: "/financeiro", label: "Financeiro" }
];

export default function Navbar() {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-surface-950/75 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Menu className="h-6 w-6 text-slate-400 lg:hidden" />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">Painel administrativo</p>
            <h2 className="text-xl font-semibold text-white">Sistema da banda</h2>
          </div>
        </div>

        <div className="hidden min-w-80 items-center rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 md:flex">
          <Search className="mr-2 h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-500">Busque nas paginas usando os filtros</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-white">{user?.login || "Usuario"}</p>
            <p className="text-xs text-slate-500">{user?.roles?.join(", ") || "membro"}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-red-400/40 hover:text-red-300"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
        {mobileNavigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              [
                "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium",
                isActive ? "bg-accent-500/15 text-accent-500" : "text-slate-400"
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
