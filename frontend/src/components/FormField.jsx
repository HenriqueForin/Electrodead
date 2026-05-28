export default function FormField({ label, name, onChange, options, type = "text", value }) {
  const baseClass =
    "mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-accent-500/60";

  return (
    <label className="block text-sm font-medium text-slate-300">
      {label}
      {options ? (
        <select className={baseClass} name={name} onChange={onChange} value={value || ""}>
          <option value="">Selecione</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input className={baseClass} name={name} onChange={onChange} type={type} value={value || ""} />
      )}
    </label>
  );
}
