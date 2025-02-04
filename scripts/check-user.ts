import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { users } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkUser() {
  const email = 'gloirembonyi@gmail.com';

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    const db = drizzle(pool);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (user) {
      console.log('User found:', {
        id: user.id,
        email: user.email,
        hasPassword: !!user.hashedPassword,
        isAdmin: user.isAdmin,
        mfaEnabled: user.mfaEnabled,
      });
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error checking user:', error);
  }
}

checkUser(); 