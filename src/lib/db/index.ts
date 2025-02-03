import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Initialize Neon HTTP client with proper type casting
const sql = neon(process.env.DATABASE_URL) as unknown as ReturnType<typeof neon<boolean, boolean>>;
export const db = drizzle(sql, { schema });

// Helper function to test the database connection
export async function testConnection() {
  try {
    const result = await db.select().from(schema.users).limit(1);
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
} 