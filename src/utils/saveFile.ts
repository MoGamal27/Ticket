import path from "path";
import fs from "fs/promises";
import { Request } from "express";
import multer from "multer";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(__dirname, '../../uploads/medical');
    fs.mkdir(folder, { recursive: true }).then(() => {
      cb(null, folder);
    }).catch(err => {
      cb(err, folder);
    });
  },
  filename: (req, file, cb) => {
    const medicalId = req.body.medicalId || req.params.medicalId;
    const extension = file.mimetype.startsWith('image/') 
      ? file.mimetype.split('/')[1] 
      : 'pdf';
    const filename = `${medicalId}-${Date.now()}.${extension}`;
    cb(null, filename);
  }
});

export const upload = multer({ storage });

export async function saveFile(
  file: Express.Multer.File,
  medicalId: number,
  req: Request
): Promise<{ url: string; type: string }> {
  const isImage = file.mimetype.startsWith('image/');
  
  return {
    url: `${req.protocol}://${req.get('host')}/uploads/medical/${file.filename}`,
    type: isImage ? 'image' : 'file'
  };
}