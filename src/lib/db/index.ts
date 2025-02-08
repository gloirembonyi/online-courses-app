import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Load environment variables
config();

// Check for DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. Please check your .env file and ensure it contains a valid database connection string.'
  );
}

// Initialize Neon HTTP client with proper type casting
const sql = neon(DATABASE_URL) as ReturnType<typeof neon<boolean, boolean>>;
export const db = drizzle(sql, { schema });

// Helper function to test the database connection
export async function testConnection() {
  try {
    const result = await db.select().from(schema.users).limit(1);
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
} 