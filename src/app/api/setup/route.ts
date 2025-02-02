import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Check if admin user already exists
    const adminExists = await db.select().from(users).where(eq(users.isAdmin, true)).execute();

    if (adminExists.length > 0) {
      return NextResponse.json(
        { message: "Admin user already exists" },
        { status: 400 }
      );
    }

    // Create admin user
    const hashedPassword = await hash("admin123", 12);
    const newAdmin = await db.insert(users).values({
      email: "admin@example.com",
      name: "Admin User",
      password: hashedPassword,
      isAdmin: true,
    }).returning();

    if (!newAdmin || newAdmin.length === 0) {
      throw new Error("Failed to create admin user");
    }

    return NextResponse.json(
      { message: "Admin user created successfully", user: { email: newAdmin[0].email, name: newAdmin[0].name } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error creating admin user" },
      { status: 500 }
    );
  }
} 