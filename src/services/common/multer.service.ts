import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Common Multer Service
export const configureMulter = (tempDir: string) => {
  const tempStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      cb(null, tempDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  return multer({ storage: tempStorage });
};