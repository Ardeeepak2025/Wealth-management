import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <AuthWrapper title="Welcome back" subtitle="Sign in with your Finova account to continue trading.">
      <LoginForm />
    </AuthWrapper>
  );
}
