
import { Notices, SmsLogs,NoticesHolder } from '../../database/models';
import axios from "axios";

export class SmsHelper {

    constructor() {

    }

    public prepareSms = async (noticeData) => {
        if (noticeData['PDFDocument.downloadLink'] != null) {
            const response = await this.sendSms(noticeData.contact, noticeData['PDFDocument.downloadLink']);
            if (Object.keys(response).includes('data')) {
                if (response['data']['data']['MsgStatus'] == 'Sent') {
                    this.dataShifting(noticeData, 1, (noticeId) => {
                        this.smsLogger(noticeId, noticeData, { message: response['message'], status: response['data']['data']['MsgStatus'], transactionId: response['data']['data']['Transaction_ID'], balance: response['data']['data']['Balance'], currentBalance: response['data']['data']['CurrentBalance'] });
                    });
                    return 'sent';
                } else {
                    this.dataShifting(noticeData, 0, (noticeId) => {
                        this.smsLogger(noticeId, noticeData, { message: response['message'], status: 'Failed', transactionId: 'NA', balance: 'NA', currentBalance: 'NA' });
                    });
                    return 'failed';
                }
            } else {
                return 'failed';
            }
        } else {
            return 'nolink';
        }
    }


    public getSmsDeliveryStatus = async (transactionId) => {
        if (transactionId != null) {
            const response = await this.getDeliveryStatus(transactionId);
            return response['data'][0].Status
        }

    }

    private smsLogger = async (noticeId, notice, smsResponse) => {
        await SmsLogs.create({
            noticeId: noticeId,
            lan: notice.lan,
            notice: notice.noticeType,
            message: smsResponse.message,
            status: smsResponse.status,
            transactionId: smsResponse.transactionId,
            balance: smsResponse.balance,
            currentBalance: smsResponse.currentBalance
        });
    }

    private dataShifting = async (notice, status, callback) => {
        await Notices.create({
            transactionId: this.generateTransactionId(10),
            lan: notice.lan,
            noticeType: notice.noticeType,
            name: notice.name,
            contact: notice.contact,
            address: notice.address,
            city: notice.city,
            state: notice.state,
            pincode: notice.pincode,
            language: notice.language,
            communicationType: notice.communicationType,
            smsStatus: status
        }).then(result => { callback(result.id) });
        await NoticesHolder.destroy({ where: { lan: notice.lan } });
    }

    public sendSms = async (receiverContact, downloadableLink): Promise<object> => {
        try {
            const message = `Attention! Click Here  ${downloadableLink} to view details.`;
            const response = await axios.get(`http://111.11.111.4/API/pushsms.aspx?loginID=siddhant&password=test&mobile=${receiverContact}&text=${message}&senderid=sid@123&route_id=2&Unicode=0&Template_id=1207168137507556856`);
            return { status: true, data: response, message: message };

        } catch (error) {
            return { status: false, message: error };
        }
    }

    private generateTransactionId(length) {
        const chars = '0123456789';
        const charLength = chars.length;
        let id = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charLength);
            id += chars[randomIndex];
        }
        return id;
    }
    public getDeliveryStatus = async (transactionId): Promise<object> => {
        try {
            const response = await axios.get(`http://111.11.111.4/API/GetReport.aspx?loginID=siddhnat&password=Chea@1964&TransactionID=${transactionId}`);
            return { status: true, data: response.data };
        } catch (error) {
            return { status: false, message: error };
        }
    }
}