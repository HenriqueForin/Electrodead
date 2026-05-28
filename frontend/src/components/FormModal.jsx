import { X } from "lucide-react";

import ActionButton from "./ActionButton.jsx";

export default function FormModal({ children, onClose, onSubmit, open, submitLabel = "Salvar", title }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <form
        className="w-full max-w-xl rounded-lg border border-white/10 bg-surface-900 p-5 shadow-soft"
        onSubmit={onSubmit}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4">{children}</div>

        <div className="mt-6 flex justify-end gap-3">
          <ActionButton onClick={onClose} variant="ghost">
            Cancelar
          </ActionButton>
          <ActionButton type="submit">{submitLabel}</ActionButton>
        </div>
      </form>
    </div>
  );
}
