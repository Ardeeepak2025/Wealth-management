import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <AuthWrapper title="Create your account" subtitle="Choose your role and start managing your finance workspace.">
      <RegisterForm />
    </AuthWrapper>
  );
}
