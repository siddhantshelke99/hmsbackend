import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

AWS.config.update({
    accessKeyId: process.env.accessKeyId as string,
    secretAccessKey: process.env.secretAccessKey as string,
    region: 'ap-south-1',
});

const s3 = new AWS.S3();

export const uploadToS3 = async (tempPath: string, targetPath: string): Promise<{ message: string, uploadData?: AWS.S3.ManagedUpload.SendData, error?: string }> => {
    const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: process.env.Bucket as string,
        Key: targetPath,
        Body: fs.createReadStream(tempPath),
    };

    const uploadFile = (): Promise<AWS.S3.ManagedUpload.SendData> => {
        return new Promise((resolve, reject) => {
            s3.upload(uploadParams, (err, data) => {
                if (err) {
                    console.error('Error uploading file:', err);
                    reject(err);
                } else {
                    console.log('File uploaded successfully. ETag:', data.ETag);
                    resolve(data);
                }
            });
        });
    };

    try {
        const uploadData = await uploadFile();
        console.log('Upload success:', uploadData);
        return { message: 'Upload success', uploadData };
    } catch (error) {
        console.error('Upload failed:', (error as Error).message);
        return { message: 'Upload failed', error: (error as Error).message };
    }
}

export const downloadFromS3 = async (targetPath: string): Promise<fs.ReadStream> => {
    const downloadParams: AWS.S3.GetObjectRequest = {
        Bucket: process.env.Bucket as string,
        Key: targetPath,
    };

    return new Promise((resolve, reject) => {
        const readStream: any = s3.getObject(downloadParams).createReadStream();

        readStream.on('error', (error) => {
            reject(error);
        });

        resolve(readStream);
    });
}

export const deleteFromS3 = async (targetPath: string): Promise<{ message: string, error?: string }> => {
    const deleteParams: AWS.S3.DeleteObjectRequest = {
        Bucket: process.env.Bucket as string,
        Key: targetPath,
    };

    const deleteFile = (): Promise<AWS.S3.DeleteObjectOutput> => {
        return new Promise((resolve, reject) => {
            s3.deleteObject(deleteParams, (err, data) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    reject(err);
                } else {
                    console.log('File deleted successfully.');
                    resolve(data);
                }
            });
        });
    };

    try {
        await deleteFile();
        return { message: 'Deletion success' };
    } catch (error) {
        console.error('Deletion failed:', (error as Error).message);
        return { message: 'Deletion failed', error: (error as Error).message };
    }
}

export const downloadDirectory = async (s3Path: string): Promise<void> => {
    const listParams: AWS.S3.ListObjectsV2Request = {
        Bucket: process.env.Bucket as string,
        Prefix: s3Path,
    };

    try {
        const { Contents } = await s3.listObjectsV2(listParams).promise();

        for (const object of Contents || []) {
            const downloadParams: AWS.S3.GetObjectRequest = {
                Bucket: process.env.Bucket as string,
                Key: object.Key,
            };
            const localFilePath = path.join(s3Path, path.basename(object.Key));
            await new Promise<void>((resolve, reject) => {
                s3.getObject(downloadParams)
                    .createReadStream()
                    .pipe(fs.createWriteStream(localFilePath))
                    .on('finish', resolve)
                    .on('error', reject);
            });
            console.log(`Downloaded: ${object.Key} to ${localFilePath}`);
        }
        console.log('All files downloaded successfully.');
    } catch (error) {
        console.error('Error downloading files:', (error as Error).message);
    }
};
