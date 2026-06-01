import { motion } from "framer-motion";
import { Lock, Mail, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { RoleSelector } from "./RoleSelector";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";
import { isEmail, passwordMessage, required } from "@/utils/validation";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const passwordError = passwordMessage(password);
    if (!required(name) || !required(email) || !required(password)) {
      toast.error("All registration fields are required");
      return;
    }
    if (!isEmail(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (passwordError) {
      toast.error(passwordError);
      return;
    }
    setSubmitting(true);
    try {
      await register({ name, email, password, role });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.form className="space-y-5" onSubmit={handleSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" icon={<UserRound className="h-4 w-4" />} />
      <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@finova.app" icon={<Mail className="h-4 w-4" />} />
      <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" icon={<Lock className="h-4 w-4" />} />
      <RoleSelector value={role} onChange={setRole} />
      <Button className="w-full" type="submit" isLoading={submitting}>
        Create account
      </Button>
      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link className="font-semibold text-sky-300 hover:text-sky-200" to="/login">
          Sign in
        </Link>
      </p>
    </motion.form>
  );
}
