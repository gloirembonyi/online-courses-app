import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Error",
  description: "An error occurred during authentication",
};

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600">
            {searchParams.error === "CredentialsSignin"
              ? "Invalid email or password. Please try again."
              : "An error occurred during authentication. Please try again."}
          </p>
          <div className="mt-6">
            <a
              href="/auth/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
