import multer from 'multer';
import path from 'path';
import fs from 'fs';

export class MulterService {
  private static createDirectory(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  public static getMulterMiddleware(tempDir: string, permanentDir: string, fieldConfigs: { name: string; maxCount: number }[]) {
    // Ensure temporary and permanent directories exist
    this.createDirectory(tempDir);
    this.createDirectory(permanentDir);

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, tempDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
        const safeName = file.originalname.replace(/ /g, '_');
        cb(null, `${uniqueSuffix}_${safeName}`);
      },
    });

    const upload = multer({ storage });

    return upload.fields(fieldConfigs);
  }

  public static moveFileToPermanent(file: Express.Multer.File, permanentSubDir: string): string {
    const permanentPath = path.join(permanentSubDir, file.filename);
    try {
      this.createDirectory(permanentSubDir);
      fs.renameSync(file.path, permanentPath);
      return permanentPath;
    } catch (error) {
      console.error(`Error moving file to permanent directory: ${permanentPath}`, error);
      throw error;
    }
  }
}