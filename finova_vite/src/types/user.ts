import type { UserRole } from "./auth";

export interface ProfileForm {
  name: string;
  email: string;
  role: UserRole;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationPreference {
  id: string;
  label: string;
  enabled: boolean;
}
