import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search" }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input
        className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/60 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/70 focus:ring-2 focus:ring-sky-400/20"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
