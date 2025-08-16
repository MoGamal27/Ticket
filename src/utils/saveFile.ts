import path from "path";
import fs from "fs/promises";
import { Request } from "express";

export async function saveFile(
  base64: string,
  medicalId: number,
  req: Request
): Promise<{ url: string; type: string }> {
  const matches = base64.match(/^data:(.+?);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 format");

  const mimeType = matches[1];
  const isImage = mimeType.startsWith('image/');
  const extension = isImage ? mimeType.split('/')[1] : 'pdf'; // Default to PDF for files

  const filename = `${medicalId}-${Date.now()}.${extension}`;
  const folder = path.join(__dirname, '../../uploads/medical');
  
  await fs.mkdir(folder, { recursive: true });
  const filePath = path.join(folder, filename);
  await fs.writeFile(filePath, Buffer.from(matches[2], 'base64'));

  return {
    url: `${req.protocol}://${req.get('host')}/medical-docs/${filename}`,
    type: isImage ? 'image' : 'file'
  };
}