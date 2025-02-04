import { hash } from 'bcryptjs';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { users } from '../src/lib/db/schema';
import * as dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  const email = 'gloirembonyi@gmail.com';
  const password = 'Password123!';
  const name = 'Test Admin';

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    const db = drizzle(pool);

    const hashedPassword = await hash(password, 12);
    
    const [admin] = await db.insert(users)
      .values({
        email,
        hashedPassword,
        name,
        isAdmin: true,
        mfaEnabled: false,
      })
      .returning();

    console.log('Admin user created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin(); 