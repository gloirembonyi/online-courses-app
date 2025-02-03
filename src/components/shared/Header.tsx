import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { Button } from "@/components/ui/button";

export async function Header() {
  const session = await getServerSession(authConfig);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Course Platform
            </Link>
            <nav className="ml-10 hidden space-x-8 md:flex">
              <Link
                href="/courses"
                className="text-gray-600 hover:text-gray-900"
              >
                Courses
              </Link>
              {session?.user.isAdmin && (
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {session.user.email}
                </span>
                <Link href="/api/auth/signout">
                  <Button variant="outline">Sign Out</Button>
                </Link>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
