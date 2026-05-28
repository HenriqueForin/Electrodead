export default function ActionButton({ children, icon: Icon, onClick, type = "button", variant = "primary" }) {
  const variants = {
    danger: "border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/15",
    ghost: "border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.07]",
    primary: "border-accent-500/30 bg-accent-500/15 text-accent-500 hover:bg-accent-500/20"
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${variants[variant]}`}
      onClick={onClick}
      type={type}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}
