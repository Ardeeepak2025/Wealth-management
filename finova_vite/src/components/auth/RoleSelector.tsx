import type { UserRole } from "@/types/auth";
import { roleLabel, roles } from "@/utils/roleUtils";

interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-300">Role</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
              value === role ? "border-sky-400/60 bg-sky-400/15 text-sky-200" : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/10"
            }`}
          >
            {roleLabel(role)}
          </button>
        ))}
      </div>
    </div>
  );
}
