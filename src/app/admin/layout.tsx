import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  if (!session.user.isAdmin) {
    redirect("/auth/error?error=AccessDenied");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
