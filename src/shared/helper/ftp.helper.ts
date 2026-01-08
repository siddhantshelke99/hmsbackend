// import ftp from 'ftp';
// // import client from 'ssh2-sftp-client'
// import config from '../../../config/ftp.json';


// require('dotenv').config();

// export class SyncReaderHelper {

//     constructor() { }

//     public async testFtp () {
//         const ftpClient = new ftp();
//         ftpClient.connect({
//             host: config.ftp.ednpoint,
//             user: config.ftp.username,
//             password: config.ftp.password,
//             port: config.ftp.port,
//         });
//         try {
//             ftpClient.on('ready', () => {
//                 console.log("CONNECTED, READY.");
//             });
//         } catch (error) {
//             console.log("CATCH ERROR - ", error);
//         }
//     }
// }

// const sftc = new SyncReaderHelper();
// sftc.testFtp();