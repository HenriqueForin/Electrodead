export default function LoadingState({ label = "Carregando dados..." }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-slate-400 shadow-soft">
      {label}
    </div>
  );
}
