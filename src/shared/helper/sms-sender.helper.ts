
import axios from 'axios'
import { CheapSmsConstants } from '../constant/sms-gateway.constant';

export class SmsSender {
    private params: any;
    constructor () {
        this.params = CheapSmsConstants;
    }

    public async sendSms (contact: string, text: string = "") {
        text = `Dear Welcome,Greetings from Welcome thank you`;
        const smsResult = await axios.get(`${this.params.api}?loginID=${this.params.loginId}&password=${this.params.password}&mobile=${contact}&text=${text}&senderid=${this.params.senderId}&route_id=${this.params.routeId}&Unicode=${this.params.unicode}&Template_id=${this.params.templteId}`)
        return smsResult;
    }

}