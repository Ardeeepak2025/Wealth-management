import { UserRound } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { useAuth } from "@/hooks/useAuth";
import { roleLabel } from "@/utils/roleUtils";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <Topbar title="Profile" description="Your authenticated Finova identity and role." />
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-sky-400/15 text-sky-300">
            <UserRound className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <p className="mt-1 text-slate-400">{user?.email}</p>
            <p className="mt-3 inline-flex rounded-lg bg-sky-400/15 px-3 py-1 text-sm font-semibold text-sky-200">{user?.role ? roleLabel(user.role) : "User"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
