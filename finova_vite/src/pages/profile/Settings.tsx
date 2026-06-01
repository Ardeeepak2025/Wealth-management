import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Topbar } from "@/components/layout/Topbar";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/services/profileService";
import type { UserRole } from "@/types/auth";
import { roleLabel, roles } from "@/utils/roleUtils";
import { saveSession, getToken } from "@/utils/token";
import { displayError } from "@/utils/errorHandler";

export default function Settings() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState<UserRole>(user?.role || "USER");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const updated = await profileService.updateProfile({ name, email, role });
      const nextUser = { ...updated, id: user?.id || updated.id };
      setUser(nextUser);
      if (getToken()) saveSession(getToken() || "", nextUser);
      toast.success("Settings updated");
    } catch (error) {
      displayError(error, { title: "Failed to update settings" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Topbar title="Settings" description="Update local profile preferences used across the Finova UI." />
      <form className="glass-card rounded-2xl p-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} />
          <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              title="Role can only be changed by administrators"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {roleLabel(r)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Role can only be changed by administrators</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button type="submit" isLoading={submitting}>
            Save settings
          </Button>
        </div>
      </form>
    </div>
  );
}
