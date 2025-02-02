import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "./email";
import { add } from "date-fns";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        verificationCode: { label: "Verification Code", type: "text" }
      },
      async authorize(credentials) {
        console.log("Attempting to authorize with credentials:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          return null;
        }

        try {
          const [user] = await db.select().from(users).where(eq(users.email, credentials.email));
          console.log("Found user:", user ? "yes" : "no");
          
          if (!user || !user.hashedPassword) {
            console.log("No user found or missing password");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.hashedPassword);
          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            return null;
          }

          // If MFA is enabled and no verification code provided, generate and send a new one
          if (user.mfaEnabled && !credentials.verificationCode) {
            const token = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = add(new Date(), { minutes: 10 });

            await db.insert(verificationTokens).values({
              userId: user.id,
              token,
              expiresAt,
            });

            await sendVerificationEmail(user.email, token);

            // Return null with a special error to indicate MFA is required
            throw new Error("MFA_REQUIRED");
          }

          // If verification code is provided, validate it
          if (credentials.verificationCode) {
            const [verificationToken] = await db
              .select()
              .from(verificationTokens)
              .where(eq(verificationTokens.userId, user.id))
              .where(eq(verificationTokens.token, credentials.verificationCode))
              .where(eq(verificationTokens.used, false));

            if (!verificationToken || verificationToken.expiresAt < new Date()) {
              throw new Error("INVALID_CODE");
            }

            // Mark the token as used
            await db
              .update(verificationTokens)
              .set({ used: true })
              .where(eq(verificationTokens.id, verificationToken.id));
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          throw error;
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
      console.log("JWT callback - user:", user);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token);
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET
};
