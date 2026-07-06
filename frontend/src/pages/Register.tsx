import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setIsLoading(true);
    try {
      await register(fullName, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      headline="Analyze. Optimize. Get Hired."
      subline="Build a smarter resume workflow with AI-powered insights, instant CV generation, and a personalized resume builder."
    >
      <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-100">
        Create Your Account
      </h2>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Start your job search journey</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <Input id="fullName" label="Full Name" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <Input id="email" type="email" label="Email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input id="password" type="password" label="Password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input id="confirmPassword" type="password" label="Confirm Password" placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

        {error && (
          <div className="rounded-lg bg-bad/10 border border-bad/20 px-3 py-2 text-sm text-bad">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-ink-500 dark:text-ink-400">
        By signing up, you agree to our Terms &amp; Privacy Policy
      </p>
      <p className="mt-2 text-center text-sm text-ink-500 dark:text-ink-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-accent-400 hover:text-accent-300 transition-colors">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
