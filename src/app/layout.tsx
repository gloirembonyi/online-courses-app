import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { ThemeProvider } from "@/components/theme/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Course Platform - Learn and Grow",
  description: "A modern platform for online learning and skill development",
  icons: {
    icon: "/favicon.ico",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
            <Header />
            <main className="flex-grow">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
