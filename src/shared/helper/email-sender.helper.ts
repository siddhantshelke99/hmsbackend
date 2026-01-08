import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import { EmailGatewayConstants } from '../constant/email-gateway.constat';

export class EmailSender {

    private params: any;
    constructor() {
       this.params = EmailGatewayConstants;
    }

    public async sendEmail(name: string, to: string, subject: string, templatePath: string, data: any, cc: string[] = [], bcc: string[] = []) {
        const transport = nodemailer.createTransport({
            host: this.params.HOST,
            port: this.params.PORT,
            secure: this.params.SSL === 'true' ? true : false,
            auth: {
                user: this.params.USERNAME,
                // pass: this.params.PASSWORD
            },
            tls: {
                rejectUnauthorized: this.params.TLS === 'true' ? true : false
            }
        });
        const htmlContent = fs
            .readFileSync(templatePath, {
                encoding: "utf-8"
            }).toString();
        const template = handlebars.compile(htmlContent)
        const htmlToSend = template(data)
        const message = {
            from: `Eeze <${this.params.SENDERID}>`,
            to,
            bcc,
            cc,
            subject,
            html: htmlToSend
        }
        return new Promise((resolve, reject) => {
            transport.sendMail(message, (error, infor) => {
                if (error) {
                    reject({ success: false, message: error })
                }
                resolve({ success: true })
            })
        })
    }
}