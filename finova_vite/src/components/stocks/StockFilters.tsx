export function StockFilters({ sectors, value, onChange }: { sectors: string[]; value: string; onChange: (sector: string) => void }) {
  return (
    <select
      className="h-11 rounded-lg border border-white/10 bg-slate-950/60 px-3 text-sm text-slate-200 outline-none focus:border-sky-400/70"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">All sectors</option>
      {sectors.map((sector) => (
        <option key={sector} value={sector}>
          {sector}
        </option>
      ))}
    </select>
  );
}
