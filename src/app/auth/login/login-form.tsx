"use client";

import { signIn } from "@/lib/auth";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Mail, Lock } from "lucide-react";

interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        throw new Error(result?.error || "Failed to sign in");
      }

      router.push(callbackUrl || "/");
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
