import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Topbar } from "@/components/layout/Topbar";
import { profileService } from "@/services/profileService";
import type { ChangePasswordPayload } from "@/types/user";

export default function ChangePassword() {
  const [form, setForm] = useState<ChangePasswordPayload>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof ChangePasswordPayload>(key: K, value: ChangePasswordPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      const response = await profileService.changePassword(form);
      toast.success(response.message);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Topbar title="Change Password" description="Submit a password change request for your authenticated profile." />
      <form className="glass-card max-w-2xl rounded-2xl p-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input label="Current Password" type="password" value={form.currentPassword} onChange={(event) => update("currentPassword", event.target.value)} />
          <Input label="New Password" type="password" value={form.newPassword} onChange={(event) => update("newPassword", event.target.value)} />
          <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} />
        </div>
        <div className="mt-5 flex justify-end">
          <Button type="submit" isLoading={submitting}>
            Update password
          </Button>
        </div>
      </form>
    </div>
  );
}
