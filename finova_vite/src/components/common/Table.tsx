import type { TableColumn } from "@/types/api";

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  emptyText?: string;
}

export function Table<T>({ columns, data, keyExtractor, emptyText = "No records found." }: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/[0.04]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 ${column.className || ""}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-slate-950/25">
            {data.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-sm text-slate-400" colSpan={columns.length}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={keyExtractor ? keyExtractor(row, rowIndex) : rowIndex} className="transition hover:bg-white/[0.03]">
                  {columns.map((column) => (
                    <td key={column.key} className={`whitespace-nowrap px-4 py-3 text-sm text-slate-200 ${column.className || ""}`}>
                      {column.render ? column.render(row, rowIndex) : String((row as Record<string, unknown>)[column.key] ?? "")}
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
