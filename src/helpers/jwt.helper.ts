import { sign, SignOptions } from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

export class JwtHelper {

    constructor () {}

    public generateToken = (payload: object | string, expiresIn: string): string => {
        const privateKey = fs.readFileSync(path.join(__dirname, '../../config/private.key'));
        const signInOptions: SignOptions = {
            algorithm: 'HS256',
            expiresIn: expiresIn
        }
        return sign(payload, privateKey, signInOptions);
    }

}
