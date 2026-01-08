const ftp = require('ftp');
const config = require('../../config/ftp.json');

require('dotenv').config();

export class FtpHelper {

    constructor() { }

    public async syncDocuments(path, resolver, rejector) {

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
                        return {
                            documentName: item.name,
                            documentSize: item.size,
                            documentPath: path,
                            downloadablePath: path + '/' + item.name,
                            downloadLink: process.env.DOWNLOAD_LINK + '/' + path + '/' + item.name,
                            downloadCount: 0,
                        }
                    });
                    resolver(restructedArray);
                    ftpClient.end();
                }
            });
            ftpClient.removeAllListeners('ready');
        });
    }

    public async downloaFile(filePath, res, resolver, rejector) {
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
                        const splits = filePath.split('/');
                        const fileName = splits[splits.length - 1];
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
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

}