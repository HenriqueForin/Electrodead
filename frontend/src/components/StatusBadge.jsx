export default function StatusBadge({ children, variant = "default" }) {
  const variants = {
    credit: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
    danger: "bg-red-500/10 text-red-300 ring-red-400/20",
    default: "bg-slate-500/10 text-slate-300 ring-slate-400/20",
    ok: "bg-cyan-500/10 text-cyan-300 ring-cyan-400/20",
    warning: "bg-amber-500/10 text-amber-300 ring-amber-400/20"
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ${variants[variant]}`}>
      {children}
    </span>
  );
}
