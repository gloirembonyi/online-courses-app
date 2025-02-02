import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <nav className="border-b bg-white h-16">
      <div className="h-full container flex items-center justify-between">
        <Link href="/" className="font-semibold text-xl">
          Course App
        </Link>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
