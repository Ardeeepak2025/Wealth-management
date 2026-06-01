import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 px-1 pt-4 text-sm text-slate-400 sm:flex-row">
      <span>
        Page {page} of {pageCount} · {total} records
      </span>
      <div className="flex items-center gap-2">
        <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)} icon={<ChevronLeft className="h-4 w-4" />}>
          Prev
        </Button>
        <Button variant="secondary" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} icon={<ChevronRight className="h-4 w-4" />}>
          Next
        </Button>
      </div>
    </div>
  );
}
