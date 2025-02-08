import fs from "fs";
import path from "path";

export async function uploadFile(file: File, type: "video" | "image"): Promise<string> {
  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", type);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + "-" + file.name.replace(/[^a-zA-Z0-9.-]/g, "");
    const filepath = path.join(uploadDir, filename);

    // Convert File to Buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filepath, buffer);

    // Return the public URL
    return `/uploads/${type}/${filename}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
} 