"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        email: needsVerification ? email : email,
        password: needsVerification ? password : password,
        verificationCode: needsVerification ? verificationCode : undefined,
        redirect: false,
        callbackUrl: callbackUrl || "/admin",
      });

      if (!result) {
        setError("Something went wrong. Please try again.");
        return;
      }

      // Handle different error types
      switch (result.error) {
        case "INVALID_CREDENTIALS":
          setError("Invalid email or password");
          setNeedsVerification(false);
          break;
        case "MFA_REQUIRED":
          setNeedsVerification(true);
          setError("Please check your email for a verification code");
          break;
        case "INVALID_CODE":
          setError("Invalid verification code. Please check and try again.");
          break;
        case "EXPIRED_CODE":
          setError("Verification code has expired. Please request a new one.");
          setNeedsVerification(false);
          break;
        case null:
          // Success case
          if (result.url) {
            router.push(result.url);
            router.refresh();
          }
          break;
        default:
          setError("An unexpected error occurred");
      }
    } catch (error) {
      setError("An error occurred during sign in");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error === "MFA_REQUIRED") {
        setError("A new verification code has been sent to your email");
      } else {
        setError("Failed to resend verification code");
      }
    } catch (error) {
      setError("Failed to resend verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {error && (
        <div
          className={`border-l-4 p-4 mb-4 ${
            error.includes("verification code") ||
            error.includes("check your email")
              ? "bg-blue-50 border-blue-400"
              : "bg-red-50 border-red-400"
          }`}
        >
          <p
            className={
              error.includes("verification code") ||
              error.includes("check your email")
                ? "text-blue-700"
                : "text-red-700"
            }
          >
            {error}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-md shadow-sm space-y-4">
          {!needsVerification ? (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </>
          ) : (
            <div>
              <label
                htmlFor="verificationCode"
                className="block text-sm font-medium text-gray-700"
              >
                Verification Code
              </label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                required
                autoFocus
                maxLength={6}
                pattern="[0-9]{6}"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit code"
              />
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500"
              >
                Resend verification code
              </button>
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : needsVerification ? (
              "Verify Code"
            ) : (
              "Sign in"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
