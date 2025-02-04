import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";
import { auth } from "@/lib/next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Course App",
  description: "A modern course management application",
  icons: {
    icon: "/favicon.ico",
  },
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
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
