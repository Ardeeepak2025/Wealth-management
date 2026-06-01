export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.08] ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-5 h-8 w-36" />
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-3/4" />
    </div>
  );
}
