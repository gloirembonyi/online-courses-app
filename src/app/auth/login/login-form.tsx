"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Mail, Lock, ShieldCheck } from "lucide-react";

interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await fetch("/api/auth/csrf");
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
        setError("Failed to initialize login. Please refresh the page.");
      }
    };
    getCsrfToken();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!csrfToken) {
      setError("Please wait for the page to initialize or refresh.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const signInData = {
        email,
        password,
        csrfToken,
        redirect: false,
      };

      if (needsVerification && verificationCode) {
        Object.assign(signInData, { verificationCode });
      }

      const result = await signIn("credentials", signInData);

      if (!result) {
        throw new Error("Something went wrong. Please try again.");
      }

      if (result.error === "MFA_REQUIRED") {
        setNeedsVerification(true);
        setVerificationCode("");
        setError("Please check your email for a verification code.");
        return;
      }

      if (result.error === "INVALID_CREDENTIALS") {
        setError("Invalid email or password.");
        setNeedsVerification(false);
        setPassword("");
        return;
      }

      if (result.error === "INVALID_CODE") {
        setError("Invalid verification code. Please try again.");
        setVerificationCode("");
        return;
      }

      if (result.error === "EXPIRED_CODE") {
        setError("Verification code has expired. Please request a new one.");
        setVerificationCode("");
        return;
      }

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.ok) {
        // Force a hard reload to ensure the session is properly set
        window.location.href = callbackUrl || "/admin";
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during sign in"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!csrfToken || !needsVerification) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        email,
        password,
        csrfToken,
        redirect: false,
      });

      if (result?.error === "MFA_REQUIRED") {
        setVerificationCode("");
        setError("A new verification code has been sent to your email.");
      } else {
        throw new Error("Failed to resend verification code");
      }
    } catch (error) {
      console.error("Resend code error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to resend verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          className={`p-4 rounded-xl flex items-start gap-3 text-sm ${
            error.includes("verification code") || error.includes("check your email")
              ? "bg-blue-50 text-blue-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {error.includes("sent") ? (
            <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-medium">{error.includes("sent") ? "Code Sent" : "Sign In Error"}</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {!needsVerification ? (
          <>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <div className="relative">
              <ShieldCheck className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                placeholder="Enter 6-digit code"
                disabled={isLoading}
              />
            </div>
            <button
              type="button"
              onClick={handleResendCode}
              className="mt-2 text-sm text-blue-600 hover:text-blue-500 font-medium flex items-center gap-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending new code...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Resend verification code
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : needsVerification ? (
          <ShieldCheck className="w-5 h-5" />
        ) : (
          <Lock className="w-5 h-5" />
        )}
        {isLoading
          ? "Authenticating..."
          : needsVerification
          ? "Verify Code"
          : "Sign In"}
      </button>
    </form>
  );
}
