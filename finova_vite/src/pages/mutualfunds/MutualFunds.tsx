import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { SearchBar } from "@/components/common/SearchBar";
import { Topbar } from "@/components/layout/Topbar";
import { MutualFundCard } from "@/components/mutualfunds/MutualFundCard";
import { MutualFundModal } from "@/components/mutualfunds/MutualFundModal";
import { SIPCalculator } from "@/components/mutualfunds/SIPCalculator";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutualFunds } from "@/hooks/useMutualFunds";
import type { MutualFund } from "@/types/mutualfund";

export default function MutualFunds() {
  const { funds, loadFunds } = useMutualFunds();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MutualFund | null>(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    loadFunds();
  }, [loadFunds]);

  const filtered = useMemo(
    () =>
      funds.filter((fund) => {
        const query = debouncedSearch.toLowerCase();
        return [fund.fund_name, fund.fund_type || ""].some((value) => value.toLowerCase().includes(query));
      }),
    [debouncedSearch, funds],
  );

  return (
    <div>
      <Topbar title="Mutual Funds" description="Browse funds from the mutual fund server and estimate SIP outcomes." onRefresh={loadFunds} />
      <div className="mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search funds or categories" />
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No funds found" description="Try another search term or refresh the fund catalog." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((fund) => (
            <MutualFundCard key={fund.id} fund={fund} onClick={setSelected} />
          ))}
        </div>
      )}
      <div className="mt-6">
        <SIPCalculator />
      </div>
      <MutualFundModal fund={selected} isOpen={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
}
