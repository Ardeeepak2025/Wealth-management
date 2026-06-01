import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useAuth } from "@/hooks/useAuth";
import { isEmail, required } from "@/utils/validation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/dashboard";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!required(email) || !required(password)) {
      toast.error("Email and password are required");
      return;
    }
    if (!isEmail(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.form className="space-y-5" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@finova.app" icon={<Mail className="h-4 w-4" />} />
      <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" icon={<Lock className="h-4 w-4" />} />
      <Button className="w-full" type="submit" isLoading={submitting}>
        Sign in
      </Button>
      <p className="text-center text-sm text-slate-400">
        New to Finova?{" "}
        <Link className="font-semibold text-sky-300 hover:text-sky-200" to="/register">
          Create account
        </Link>
      </p>
      {process.env.NODE_ENV !== "production" && (
        <p className="text-center text-xs text-slate-500 border-t border-slate-700 pt-4 mt-4">
          <Link className="text-amber-400 hover:text-amber-300 font-semibold" to="/test-login">
            🧪 Test Login (Dev Only)
          </Link>
        </p>
      )}
    </motion.form>
  );
}
