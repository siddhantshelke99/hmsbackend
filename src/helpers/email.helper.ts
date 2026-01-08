
import nodemailer from 'nodemailer';
// import * as Config from '../../config/email.json';
import handlerbars from 'handlebars';
import * as fs from 'fs'

export class EmailHelper {

    constructor() { }

    async prepareEmail(data: object, receiverDetails: any, subject: string, templateId: string) {
       
        let htmlContent = fs.readFileSync(templateId, { encoding: "utf-8" }).toString();
        let transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'siddhantshelke999@gmail.com',
                pass: 'baagkauspnlhsufx',
            },
            tls: {
                rejectUnauthorized: false,
            },
            logger: true,  // Enable logging
            debug: true    // Enable debug output
        });

        let template = handlerbars.compile(htmlContent);
        var replacements = {
            data: data
        }
        
        const htmlToSend = template(replacements);
        const message = {
            from: `Inventory  <siddhantshelke999@gmail.com>`,
            to: receiverDetails.email,
            cc: receiverDetails?.cc,
            subject: subject,
            html: htmlToSend
        };

        await this.sendEmail(transport, message);
        return true;
    }

    async sendEmail(tranport: any, message: object) {
        return await tranport.sendMail(message, (error, info) => {
            if (error) {
                return false;
            }
            return true;
        })
    }

}