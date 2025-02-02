import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "./email";
import { add } from "date-fns";
import NextAuth from "next-auth";

const providers = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      verificationCode: { label: "Verification Code", type: "text" }
    },
    async authorize(credentials) {
      try {
        // Step 1: Validate basic credentials
        if (!credentials?.email || !credentials?.password) {
          throw new Error("INVALID_CREDENTIALS");
        }

        // Step 2: Find user
        const [user] = await db.select().from(users).where(eq(users.email, credentials.email));
        if (!user || !user.hashedPassword) {
          throw new Error("INVALID_CREDENTIALS");
        }

        // Step 3: Validate password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isPasswordValid) {
          throw new Error("INVALID_CREDENTIALS");
        }

        // Step 4: Handle MFA
        if (user.mfaEnabled) {
          // If this is the initial login attempt (no verification code provided)
          if (!credentials.verificationCode || credentials.verificationCode === "undefined") {
            const token = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = add(new Date(), { minutes: 10 });

            // Invalidate old tokens
            await db
              .update(verificationTokens)
              .set({ used: true })
              .where(
                and(
                  eq(verificationTokens.userId, user.id),
                  eq(verificationTokens.used, false)
                )
              );

            // Create new token
            await db.insert(verificationTokens).values({
              userId: user.id,
              token,
              expiresAt,
            });

            console.log("Sending verification email to:", user.email);
            await sendVerificationEmail(user.email, token);
            throw new Error("MFA_REQUIRED");
          }

          console.log("Verifying code:", credentials.verificationCode, "for user:", user.email);

          // Verify the code
          const [verificationToken] = await db
            .select()
            .from(verificationTokens)
            .where(
              and(
                eq(verificationTokens.userId, user.id),
                eq(verificationTokens.token, credentials.verificationCode),
                eq(verificationTokens.used, false)
              )
            )
            .orderBy(desc(verificationTokens.createdAt))
            .limit(1);

          console.log("Found verification token:", verificationToken);

          if (!verificationToken) {
            console.log("No valid verification token found");
            throw new Error("INVALID_CODE");
          }

          if (verificationToken.expiresAt < new Date()) {
            console.log("Verification token expired");
            throw new Error("EXPIRED_CODE");
          }

          // Mark token as used
          await db
            .update(verificationTokens)
            .set({ used: true })
            .where(eq(verificationTokens.id, verificationToken.id));
        }

        // Step 5: Return user data
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin
        };
      } catch (error) {
        console.error("Auth error:", error);
        if (error instanceof Error) {
          throw error; // This will propagate MFA_REQUIRED, INVALID_CODE, and INVALID_CREDENTIALS
        }
        throw new Error("UNKNOWN_ERROR");
      }
    }
  })
];

export const authOptions: NextAuthOptions = {
  providers,
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
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
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

export const { auth, signIn, signOut } = NextAuth(authOptions);
