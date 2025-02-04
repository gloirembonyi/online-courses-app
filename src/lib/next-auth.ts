import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { authConfig } from "./auth.config";

const config = {
  ...authConfig,
  pages: {
    signIn: "/admin/login",
    error: "/admin/error",
  },
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.isAdmin;
      const isAdminPanel = nextUrl.pathname.startsWith('/admin');

      if (isAdminPanel) {
        if (isLoggedIn && isAdmin) return true;
        return false; // Redirect to admin login
      }

      return true;
    }
  }
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config); 