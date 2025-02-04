import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "./email";
import { add } from "date-fns";

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        verificationCode: { label: "Verification Code", type: "text" }
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("INVALID_CREDENTIALS");
          }

          const [user] = await db.select().from(users).where(eq(users.email, credentials.email as string));
          
          if (!user || !user.hashedPassword) {
            throw new Error("INVALID_CREDENTIALS");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.hashedPassword
          );

          if (!isPasswordValid) {
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
            name: user.name ?? "",
            isAdmin: user.isAdmin ?? false
          };
        } catch (error) {
          console.error("Auth error:", error);
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("UNKNOWN_ERROR");
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = (token.name as string) ?? "";
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};
