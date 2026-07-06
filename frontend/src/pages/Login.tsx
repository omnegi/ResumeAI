import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Incorrect email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      headline="Analyze. Optimize. Get Hired."
      subline="Get an AI-powered breakdown of your resume, matched precisely against the job you want."
    >
      <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-100">
        Welcome back
      </h2>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="rounded-lg bg-bad/10 border border-bad/20 px-3 py-2 text-sm text-bad">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs font-medium text-accent-400 hover:text-accent-300 transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-accent-400 hover:text-accent-300 transition-colors">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
}
