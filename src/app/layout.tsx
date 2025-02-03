import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth.config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Course Platform",
  description: "Learn and grow with our courses",
};

type RootLayoutProps = {
  children: React.ReactNode;
  auth: boolean;
  dashboard: boolean;
};

export default async function RootLayout({
  children,
  auth: authEnabled = true,
  dashboard = false,
}: RootLayoutProps) {
  const session = await getServerSession(authConfig);

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
