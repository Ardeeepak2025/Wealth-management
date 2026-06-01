import { SearchBar } from "@/components/common/SearchBar";

export function StockSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <SearchBar value={value} onChange={onChange} placeholder="Search by symbol, company, or sector" />;
}
