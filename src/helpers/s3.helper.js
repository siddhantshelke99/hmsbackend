const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const stream = require('stream');
AWS.config.update({
    accessKeyId: `${process.env.accessKeyId}`,
    secretAccessKey: `${process.env.secretAccessKey}`,
    region: 'ap-south-1', // specify your AWS region
});
const s3 = new AWS.S3();
exports.uploadToS3 = async (tempPath, targetPath) => {
    const uploadParams = {
        Bucket: `${process.env.Bucket}`,
        Key: targetPath, // specify the key (path) where you want to store the file
        Body: fs.createReadStream(tempPath), // specify the local file path
    };
    const uploadFile = () => {
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
    await uploadFile()
        .then((uploadData) => {
            // Handle success if needed\
            console.log('Upload success:', uploadData);
            let message = {
                message: 'Upload success',
                uploadData: uploadData
            }
            return message

        })
        .catch((error) => {
            // Handle errors
            console.error('Upload failed:', error.message);

            let message = {
                message: 'Upload failed',
                error: error.message
            }
            return message
        });
}

exports.downloadFromS3 = async (targetPath) => {
    return new Promise((resolve, reject) => {
        const downloadParams = {
            Bucket: `${process.env.Bucket}`,
            Key: targetPath, // specify the key (path) of the file to download
        };

        const readStream = s3.getObject(downloadParams).createReadStream();

        readStream.on('error', (error) => {
            reject(error);
        });

        resolve(readStream);
    })
}

exports.deleteFromS3 = async (targetPath) => {
    const deleteParams = {
        Bucket: `${process.env.Bucket}`,
        Key: targetPath, // specify the key (path) of the file to delete
    };

    const deleteFile = () => {
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
    deleteFile()
        .then(() => {
            return { message: 'Deletion success' }
        })
        .catch((error) => {
            // Handle errors
            console.error('Deletion failed:', error.message);

            return { message: 'Deletion failed:', error: error.message }
        });
}

// exports.downloadDirectory = async (s3Path) => {
//     return new Promise(async (resolve, reject) => {
//         // Create an archiver instance
//         const archive = archiver('zip', {
//             zlib: { level: 9 } // Compression level (0-9)
//         });
//         const zipStream = new PassThrough();
//         // archive.pipe(zipStream);
//         const listParams = {
//             Bucket: `${process.env.Bucket}`,
//             Prefix: s3Path, // specify the S3 prefix (directory) you want to download
//         };
//         try {
//             const { Contents } = await s3.listObjectsV2(listParams).promise();
//             const promises = Contents.map(async (object) => {
//                 const downloadParams = {
//                     Bucket: `${process.env.Bucket}`,
//                     Key: object.Key,
//                 };
//                 const fileStream = await s3.getObject(downloadParams).createReadStream();
//                 // await saveReadStreamToLocal(fileStream, object.Key)
//                 archive.append(fileStream, { name: object.Key });
//             });
//             // Wait for all promises to be resolved before finalizing the archive
//             await Promise.all(promises);
//             console.log(archive);
//             archive.pipe(zipStream);
//             await archive.finalize();
//             zipStream.on('error', (error) => {
//                 reject(error);
//             });
//             resolve(zipStream);
//         } catch (error) {
//             console.error('Error downloading files:', error.message);
//         }
//     })
// };

exports.downloadDirectory = async (s3Path) => {
    return new Promise(async (resolve, reject) => {
        const listParams = {
            Bucket: `${process.env.Bucket}`,
            Prefix: s3Path,
        };

        try {
            const { Contents } = await s3.listObjectsV2(listParams).promise();
            const appendPromises = Contents.filter(ele => !ele.Key.includes('/external_files/')).map(async (object) => {
                const downloadParams = {
                    Bucket: `${process.env.Bucket}`,
                    Key: object.Key,
                };
                const fileStream = await s3.getObject(downloadParams).createReadStream();
                await saveReadStreamToLocal(fileStream, path.basename(object.Key), s3Path)
            });
            await Promise.all(appendPromises);
            const zipStream = await zipFolder('./uploads/temp_downloads/' + process.pid, './uploads/temp_downloads/' + process.pid + '-zip' + '/folder_archive.zip')
            resolve(zipStream)
        } catch (error) {
            console.error('Error downloading files:', error.message);
            reject(error);
        }
    });
};

async function saveReadStreamToLocal(readStream, fileName, s3Path) {
    return new Promise((resolve, reject) => {
        const localFilePath = './uploads/temp_downloads/' + process.pid
        fs.mkdirSync(localFilePath, { recursive: true })
        const writeStream = fs.createWriteStream(localFilePath + '/' + fileName);
        stream.pipeline(readStream, writeStream, (error) => {
            if (error) {
                reject(error);
            } else {
                console.log(`Stream saved to local file: ${localFilePath}`);
                resolve();
            }
        });
    });
}
function zipFolder(folderPath, outputPath) {
    return new Promise(async (resolve, reject) => {
        // fs.mkdirSync('./uploads/temp_downloads/' + process.pid + '-zip', { recursive: true })
        // const output = fs.createWriteStream(outputPath);
        // const archive = archiver('zip', { zlib: { level: 9 } });
        // archive.pipe(output);
        // archive.directory(folderPath, false);
        // await archive.finalize();
        // console.log(`Zip file created successfully at: ${outputPath}`);
        // const readStream = fs.createReadStream(outputPath);
        // resolve(readStream)

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.directory(folderPath, false);
        archive.finalize();
        resolve(archive);
    })
}


exports.deleteLocalFile = async (filePath) => {
    await fs.readdirSync(filePath).forEach(async element => {
        console.log('deleting ', element);
        fs.unlinkSync(filePath + '/' + element)
    })
    await fs.rmSync(filePath, { recursive: true, force: true });
}