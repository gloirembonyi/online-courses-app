import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";

async function createUser() {
  const email = "gloirembonyi@gmail.com";
  const password = "Password123!";
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.insert(users).values({
      email,
      hashedPassword,
      name: "Gloire",
      isAdmin: true,
      mfaEnabled: true,
    });
    
    console.log("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
  }
  
  process.exit(0);
}

createUser(); 