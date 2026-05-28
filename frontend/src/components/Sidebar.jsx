import { CalendarDays, DollarSign, Gauge, Guitar, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/membros", label: "Membros", icon: Users },
  { href: "/instrumentos", label: "Instrumentos", icon: Guitar },
  { href: "/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/financeiro", label: "Financeiro", icon: DollarSign }
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-surface-950/85 px-5 py-6 shadow-soft backdrop-blur-xl lg:block">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-accent-500">Electrodead</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Band Manager</h1>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-accent-500/15 text-accent-500 ring-1 ring-accent-500/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
