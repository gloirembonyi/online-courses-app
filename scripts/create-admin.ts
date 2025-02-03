import { hash } from 'bcryptjs';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users } from '../src/lib/db/schema';
import * as dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  const email = 'admin@example.com';
  const password = 'admin123'; // Change this in production
  const name = 'Admin User';

  try {
    const sql = neon<boolean, boolean>(process.env.DATABASE_URL!);
    const db = drizzle(sql);

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