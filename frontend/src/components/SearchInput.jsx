import { Search } from "lucide-react";

export default function SearchInput({ onChange, placeholder = "Buscar", value }) {
  return (
    <label className="flex w-full items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 md:max-w-sm">
      <Search className="mr-2 h-4 w-4 text-slate-500" />
      <input
        className="w-full bg-transparent outline-none placeholder:text-slate-600"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}
