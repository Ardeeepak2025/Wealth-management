import { authService } from "./authService";
import type { ChangePasswordPayload, ProfileForm } from "@/types/user";
import type { User } from "@/types/auth";

export const profileService = {
  async getProfile(): Promise<User> {
    return authService.me();
  },

  async updateProfile(profile: ProfileForm): Promise<User> {
    return {
      id: 0,
      name: profile.name,
      email: profile.email,
      role: profile.role,
    };
  },

  async changePassword(_payload: ChangePasswordPayload): Promise<{ message: string }> {
    return Promise.resolve({ message: "Password update request accepted" });
  },
};
