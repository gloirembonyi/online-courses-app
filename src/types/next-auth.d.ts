import 'next-auth';

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