
import { generate } from 'generate-password-ts';
import * as bcryptjs from 'bcryptjs';
import fs from 'fs';

export class CommonHelper {

    private salt;
    private hash;

    public generatePassword = (): string => {
        return generate({ length: 10, numbers: true });
    }

    public getPassword = (): object => {
        const password = this.generatePassword();
        this.salt = bcryptjs.genSaltSync(10);
        this.hash = bcryptjs.hashSync(password, this.salt);
        return { hash: this.hash, original: password };
    }

    public hasPassword = (password): string => {
        this.salt = bcryptjs.genSaltSync(10);
        this.hash = bcryptjs.hashSync(password, this.salt);
        return this.hash;
    }

    public comparePassword = (passwordOrg: string, passwordHash: string): boolean => {
        return bcryptjs.compareSync(passwordOrg, passwordHash)
    }

    public changeDateFormat = (data: string) => {
        let _DD_ND = data.split('-')[2]
        let _MM_ND = data.split('-')[1]
        let _yyyy_ND = data.split('-')[0]

        return _DD_ND + '-' + _MM_ND + '-' + _yyyy_ND
    }
    public createDirectory(path, directoryName) {
        fs.mkdirSync(path + '/' + directoryName, { recursive: true });
        return true;
    }
    public convertFromBase64(data, targetPath, fileName) {
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
        }
        const fileData: any = new Buffer(data, 'base64')
        const file = fs.createWriteStream(`${targetPath}/${fileName}`)
        file.once('open', function (fd) {
            console.log('Our steam is open, lets write to it');
            file.write(fileData);
            file.end();
        }); //writeSteam.once('open')
        file.on('close', function () {
            fs.statSync(`${targetPath}/${fileName}`);
        })
    }
    public async convertFromBase64Arr(dataArr, targetPath) {
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
        }
        if (dataArr?.length > 0 && dataArr?.length) {
            await Promise.all(dataArr.map(async (data) => {
                const { fileName, fileData } = data
                const file = await fs.createWriteStream(`${targetPath}/${fileName}`)
                await file.once('open', async function (fd) {
                    console.log('Our steam is open, lets write to it');
                    await file.write(new Buffer(fileData, 'base64'));
                    file.end();
                }); //writeSteam.once('open')
                await file.on('close', function () {
                    console.log('Steam Ended');

                    fs.statSync(`${targetPath}/${fileName}`);
                })
            }))
        }

    }
}