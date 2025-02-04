import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "./email";
import { add } from "date-fns";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      isAdmin: boolean;
    }
  }
}

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("INVALID_CREDENTIALS");
          }

          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email as string));

          if (!user?.hashedPassword) {
            throw new Error("INVALID_CREDENTIALS");
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.hashedPassword
          );

          if (!isValid) {
            throw new Error("INVALID_CREDENTIALS");
          }

          if (user.mfaEnabled) {
            if (!credentials.verificationCode) {
              const token = Math.floor(100000 + Math.random() * 900000).toString();
              const expiresAt = add(new Date(), { minutes: 10 });

              await db
                .update(verificationTokens)
                .set({ used: true })
                .where(
                  and(
                    eq(verificationTokens.userId, user.id),
                    eq(verificationTokens.used, false)
                  )
                );

              await db.insert(verificationTokens).values({
                userId: user.id,
                token,
                expiresAt,
              });

              await sendVerificationEmail(user.email, token);
              throw new Error("MFA_REQUIRED");
            }

            const [verificationToken] = await db
              .select()
              .from(verificationTokens)
              .where(
                and(
                  eq(verificationTokens.userId, user.id),
                  eq(verificationTokens.token, credentials.verificationCode as string),
                  eq(verificationTokens.used, false)
                )
              )
              .orderBy(desc(verificationTokens.createdAt))
              .limit(1);

            if (!verificationToken) {
              throw new Error("INVALID_CODE");
            }

            if (verificationToken.expiresAt < new Date()) {
              throw new Error("EXPIRED_CODE");
            }

            await db
              .update(verificationTokens)
              .set({ used: true })
              .where(eq(verificationTokens.id, verificationToken.id));
          }

          return {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.error("[Auth] Error during authentication:", error);
          throw error;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig; 