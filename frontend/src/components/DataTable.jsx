export default function DataTable({ columns, data, emptyMessage = "Nenhum registro encontrado." }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/[0.03]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-center text-sm text-slate-400" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="transition hover:bg-white/[0.03]">
                  {columns.map((column) => (
                    <td key={column.key} className="px-5 py-4 text-sm text-slate-200">
                      {column.render ? column.render(row) : row[column.key] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
