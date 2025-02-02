import { clerkClient } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";

export const getAuth = auth;

export async function isAdmin() {
  const { userId } = auth();
  
  if (!userId) {
    return false;
  }

  const user = await clerkClient.users.getUser(userId);
  return user?.publicMetadata?.role === "admin";
} 