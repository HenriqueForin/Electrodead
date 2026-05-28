export default function StatCard({ icon: Icon, label, tone = "sky", value }) {
  const tones = {
    cyan: "bg-cyan-500/12 text-cyan-300 ring-cyan-400/20",
    emerald: "bg-emerald-500/12 text-emerald-300 ring-emerald-400/20",
    rose: "bg-rose-500/12 text-rose-300 ring-rose-400/20",
    sky: "bg-sky-500/12 text-sky-300 ring-sky-400/20",
    violet: "bg-violet-500/12 text-violet-300 ring-violet-400/20"
  };

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-bold text-white">{value}</p>
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ring-1 ${tones[tone]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </section>
  );
}
