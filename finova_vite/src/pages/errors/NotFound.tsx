import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-finova-black p-6 text-white">
      <div className="glass-card max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-sky-500/15 text-sky-300">
          <SearchX className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm text-slate-400">The page you are looking for does not exist in Finova.</p>
        <Link className="mt-6 inline-block" to="/dashboard">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
