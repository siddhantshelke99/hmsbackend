const ftp = require('ftp');
const fs = require('fs');
const archiver = require('archiver');
const { createWriteStream } = require('fs');
const path = require('path');
const config = require('../../config/ftp.json');

require('dotenv').config();

export class SyncReaderHelper {

    constructor() { }

    public async syncReader(path, resolver, rejector) {

        const ftpClient = new ftp();
        ftpClient.connect({
            host: config.ftp.ednpoint,
            user: config.ftp.username,
            password: config.ftp.password,
            port: config.ftp.port,
        });

        ftpClient.on('ready', () => {
            ftpClient.list(path, async (err, list) => {
                if (err) { rejector('Not Found') }
                else {
                    const restructedArray = await list.map(item => {
                        const uid = this.generateUniqueId(6);
                        return {
                            uuid: uid,
                            lan: item.name.split('_')[1],
                            documentName: item.name,
                            path: path,
                            documentSize: item.size,
                            documentPath: path + '/' + item.name,
                            downloadablePath: path + '/' + item.name,
                            downloadLink: process.env.DOWNLOAD_LINK + `/${uid}`,
                            downloadCount: 0,
                        }
                    }).filter(item => item.documentName.includes('.pdf'));
                    resolver(restructedArray);
                    ftpClient.end();
                }
            });
            ftpClient.removeAllListeners('ready');
        });
    }
    public async autoSyncReader(filePath, fileSize, resolver, rejector) {

        let fileName = path.basename(filePath)
        let path_ = path.dirname(filePath);

        const uid = this.generateUniqueId(6);


        const restructedFile =
        {
            uuid: uid,
            lan: fileName.split('_')[1],
            documentName: fileName,
            path: path_,
            documentSize: fileSize,
            documentPath: filePath,
            downloadablePath: filePath,
            downloadLink: process.env.DOWNLOAD_LINK + `/${uid}`,
            downloadCount: 0,
        }
        resolver({ restructedFile });
    }
    public async autoSyncAcknowledgementReader(filePath, fileSize, resolver, rejector) {
        let fileName = path.basename(filePath)
        let path_ = path.dirname(filePath);
        const uid = this.generateUniqueId(6);
        const restructedFile =
        {
            uuid: uid,
            barcode: fileName.split('.')[0],
            documentName: fileName,
            documentSize: fileSize,
            path: path_,
            documentPath: filePath,
            downloadablePath: filePath,
            downloadLink: process.env.DOWNLOAD_LINK + `d/${uid}`,
            downloadCount: 0,
        }
        resolver({ restructedFile });
    }

    public async syncReaderAcknoledgement(path, resolver, rejector, date) {
        const ftpClient = new ftp();
        ftpClient.connect({
            host: config.ftp.ednpoint,
            user: config.ftp.username,
            password: config.ftp.password,
            port: config.ftp.port,
        });

        ftpClient.on('ready', () => {
            ftpClient.list(path, async (err, list) => {
                if (err) { rejector('Not Found') }
                else {
                    const restructedArray = await list.map(item => {
                        const uid = this.generateUniqueId(6);
                        return {
                            uuid: uid,
                            barcode: item.name.split('.')[0],
                            documentName: item.name,
                            path: path,
                            documentSize: item.size,
                            documentPath: path + '/' + item.name,
                            documentDate: new Date(date).toISOString().split('T')[0],
                            downloadablePath: path + '/' + item.name,
                            downloadLink: process.env.DOWNLOAD_LINK + `/d/${uid}`,
                            downloadCount: 0,
                        }
                    }).filter(item => item.documentName.includes('.pdf'));
                    resolver(restructedArray);
                    ftpClient.end();
                }

            })
            ftpClient.removeAllListeners('ready');
        });
    }



    public async syncFile(path, fileName, res, resolver, rejector) {
        const ftpClient = new ftp();
        ftpClient.connect({
            host: config.ftp.ednpoint,
            user: config.ftp.username,
            password: config.ftp.password,
            port: config.ftp.port,
            pasv: true
        });
        try {
            ftpClient.on('ready', () => {
                ftpClient.get(path, (err, stream) => {
                    if (err) { rejector('Not Found') }
                    else {

                        // Set the appropriate content-type for the response
                        res.setHeader('Content-Type', 'application/pdf');

                        stream.pipe(res);
                        stream.once("close", () => {
                            resolver();
                            ftpClient.end();
                        })
                    }
                });
                ftpClient.removeAllListeners('ready');
            });
        } catch (error) {
            rejector(error)
        }
    }

    public async downloadMultipleFiles(path, zipFileName, res, resolver, rejector) {
        const ftpClient = new ftp();
        const archive = archiver('zip', { zlib: { level: 9 } });
        ftpClient.connect({
            host: config.ftp.ednpoint,
            user: config.ftp.username,
            password: config.ftp.password,
            port: config.ftp.port,
            pasv: true
        });
        try {

            ftpClient.on('ready', () => {
                const zipFileStream = createWriteStream(zipFileName);
                archive.pipe(zipFileStream);
                ftpClient.get(path, (err, stream) => {
                    if (err) { rejector('Not Found') }
                    else {
                        archive.append(stream, { name: path }); console.log();
                        stream.once('close', () => {
                            console.log(`File ${path} added to zip archive`);
                        });
                        archive.finalize();
                    }
                });
                // Set the appropriate content-type for the response
                res.setHeader('Content-Type', 'application/zip');

                // Pipe the zip archive to the response
                archive.pipe(res);

                zipFileStream.on('close', () => {
                    resolver();
                    ftpClient.end();
                });

                ftpClient.removeAllListeners('ready');
            });

        } catch (error) {
            rejector(error)
        }
    }

    public async syncXlFile(filePath, fileName, resolver, rejector) {
        const ftpClient = new ftp();
        ftpClient.connect({
            host: config.ftp.ednpoint,
            user: config.ftp.username,
            password: config.ftp.password,
            port: config.ftp.port,
        });
        try {
            ftpClient.on('ready', () => {
                ftpClient.get(filePath, (err, stream) => {
                    if (err) { rejector('Not Found') }
                    else {
                        stream.once("close", () => {
                            console.log("Closed");
                            resolver(path.join(__dirname, `../../temp-storage/${fileName}`));
                            ftpClient.end();
                        })
                        stream.pipe(fs.createWriteStream(path.join(__dirname, `../../temp-storage/${fileName}`)));
                        stream.on('finish', () => {
                            console.log("Finished");
                        });
                    }

                });
                ftpClient.removeAllListeners('ready');
            });
        } catch (error) {
            rejector(error)
        }
    }

    public async unlinkFile(path) {
        fs.unlinkSync(path);
    }

    private generateUniqueId(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charLength = chars.length;
        let id = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charLength);
            id += chars[randomIndex];
        }
        return id;
    }
}