import path from "path";
import fs from "fs/promises";
import { Request } from "express";

export async function saveBase64Image(
  base64: string,
  userId: string,
  req: Request,
  folder: string
): Promise<string> {
  try {
    // Clean the base64 string - remove any whitespace
    const cleanBase64 = base64.trim();
    
    // More flexible regex to handle different base64 formats
    const matches = cleanBase64.match(/^data:([^;]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error(`Invalid base64 format. Expected format: data:mime/type;base64,data`);
    }
    
    const mimeType = matches[1];
    const base64Data = matches[2];
    
    // Validate that we have actual base64 data
    if (!base64Data || base64Data.length === 0) {
      throw new Error("No base64 data found");
    }
    
    
    let ext = 'jpg'; 
    if (mimeType.includes('/')) {
      const mimeExt = mimeType.split('/')[1];
      // Handle common MIME types and their extensions
      switch (mimeExt.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          ext = 'jpg';
          break;
        case 'png':
          ext = 'png';
          break;
        case 'gif':
          ext = 'gif';
          break;
        case 'webp':
          ext = 'webp';
          break;
        case 'bmp':
          ext = 'bmp';
          break;
        default:
          // If unknown MIME type, try to use it directly or fallback to jpg
          ext = mimeExt.length <= 4 ? mimeExt : 'jpg';
      }
    }
    
    // Validate base64 data by attempting to decode it
    let buffer: Buffer;
    try {
      buffer = Buffer.from(base64Data, "base64");
      // Additional validation - check if buffer is not empty and has reasonable size
      if (buffer.length === 0) {
        throw new Error("Decoded buffer is empty");
      }
      if (buffer.length > 10 * 1024 * 1024) { // 10MB limit
        throw new Error("Image too large (>10MB)");
      }
    } catch (bufferError) {
      throw new Error(`Failed to decode base64 data: ${bufferError instanceof Error ? bufferError.message : 'Unknown error'}`);
    }
    
    // Generate unique filename to avoid conflicts
    const timestamp = Date.now();
    const fileName = `${userId}_${timestamp}.${ext}`;
    const uploadsDir = path.join(__dirname, "../..", "uploads", folder);
    
    // Create folder if it doesn't exist
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      console.error("Failed to create directory:", err);
      throw new Error(`Failed to create upload directory: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    
    const filePath = path.join(uploadsDir, fileName);
    
    // Write the file
    try {
      await fs.writeFile(filePath, buffer);
    } catch (err) {
      console.error("Failed to write image file:", err);
      throw new Error(`Failed to write image file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    
    // Verify file was written successfully
    try {
      const stats = await fs.stat(filePath);
      if (stats.size === 0) {
        throw new Error("Written file is empty");
      }
    } catch (err) {
      throw new Error(`File verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    
    // Return full URL
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${folder}/${fileName}`;
    return imageUrl;
    
  } catch (error) {
    console.error("saveBase64Image error:", error);
    // Re-throw with more context
    throw new Error(`Image save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
