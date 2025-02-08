import { config } from 'dotenv';
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";

// Load environment variables
config();

async function createAdmin() {
  try {
    const email = "admin@example.com";
    const password = "admin123"; // Change this to a secure password
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.insert(users).values({
      email,
      hashedPassword,
      isAdmin: true,
      name: "Admin User",
      mfaEnabled: false, // Disable MFA for testing
    });
    
    console.log("Admin user created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdmin(); 