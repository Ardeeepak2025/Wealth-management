import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { Loader } from "@/components/common/Loader";
import { Topbar } from "@/components/layout/Topbar";
import { StockCard } from "@/components/stocks/StockCard";
import { StockFilters } from "@/components/stocks/StockFilters";
import { StockModal } from "@/components/stocks/StockModal";
import { StockSearch } from "@/components/stocks/StockSearch";
import { StockTable } from "@/components/stocks/StockTable";
import { useDebounce } from "@/hooks/useDebounce";
import { useStocks } from "@/hooks/useStocks";
import type { Stock } from "@/types/stock";

function searchableValue(value: unknown): string {
  return String(value ?? "").toLowerCase();
}

export default function Stocks() {
  const { stocks, loading, loadStocks } = useStocks();
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("");
  const [selected, setSelected] = useState<Stock | null>(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  const sectors = useMemo(
    () => Array.from(new Set(stocks.map((stock) => String(stock.sector ?? "").trim()).filter(Boolean))),
    [stocks],
  );
  const filteredStocks = useMemo(
    () =>
      stocks.filter((stock) => {
        const query = searchableValue(debouncedSearch);
        const matchesSearch =
          !query ||
          [stock.symbol, stock.company_name, stock.sector].some((value) =>
            searchableValue(value).includes(query),
          );
        const matchesSector = !sector || String(stock.sector ?? "") === sector;
        return matchesSearch && matchesSector;
      }),
    [debouncedSearch, sector, stocks],
  );

  return (
    <div>
      <Topbar title="Stocks" description="Search, filter, and inspect live stock records from the stock server." onRefresh={loadStocks} />
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
        <StockSearch value={search} onChange={setSearch} />
        <StockFilters sectors={sectors} value={sector} onChange={setSector} />
      </div>
      {loading && stocks.length === 0 ? (
        <Loader />
      ) : filteredStocks.length === 0 ? (
        <EmptyState title="No stocks found" description="Try changing your search or sector filter." />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredStocks.slice(0, 6).map((stock) => (
              <StockCard key={stock.id} stock={stock} onClick={setSelected} />
            ))}
          </div>
          <div className="mt-6">
            <StockTable stocks={filteredStocks} onSelect={setSelected} />
          </div>
        </>
      )}
      <StockModal stock={selected} isOpen={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
}
