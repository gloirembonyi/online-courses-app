import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Initialize Neon HTTP client
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Helper function to test the database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
} 