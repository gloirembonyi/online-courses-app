"use client";

import { User } from "next-auth";
import { signOut } from "next-auth/react";

export function UserButton({ user }: { user: User }) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-700">{user.name || user.email}</span>
      <button
        onClick={handleSignOut}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Sign out
      </button>
    </div>
  );
}
