import path from "path";
import fs from "fs/promises";
import { Request } from "express";

export async function saveBase64Image(
  base64: string,
  userId: string,
  req: Request,
  folder: string // new param
): Promise<string> {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 format");
  }

  const ext = matches[1].split("/")[1];
  const buffer = Buffer.from(matches[2], "base64");

  const fileName = `${userId}.${ext}`;
  const uploadsDir = path.join(__dirname, "../..", "uploads", folder);
  // Create folder if it doesn't exist
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    console.error("Failed to create directory:", err);
    throw err;
  }

  const filePath = path.join(uploadsDir, fileName);

  try {
    await fs.writeFile(filePath, buffer);
  } catch (err) {
    console.error("Failed to write image file:", err);
    throw err;
  }

  // Return full URL
  const imageUrl = `${req.protocol}://${req.get(
    "host"
  )}/uploads/${folder}/${fileName}`;
  return imageUrl;
}
