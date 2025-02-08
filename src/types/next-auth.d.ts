import 'next-auth';

/// <reference types="@clerk/nextjs" />

declare module "@clerk/nextjs" {
  export * from "@clerk/nextjs/dist/types";
}

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    isAdmin: boolean;
  }

  interface Session {
    user: User;
  }
} 