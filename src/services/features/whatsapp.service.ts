import twilio from 'twilio';

class WhatsAppService {
  private client;
  private fromNumber: string;

  constructor() {
    // Twilio credentials (replace with your actual credentials)
    const accountSid = process.env.TWILIO_ACCOUNT_SID || 'your_account_sid';
    const authToken = process.env.TWILIO_AUTH_TOKEN || 'your_auth_token';
    this.fromNumber = 'whatsapp:+14155238886'; // Twilio WhatsApp sandbox number

    this.client = twilio(accountSid, authToken);
  }

  // Send a WhatsApp message
  async sendNotification(to: string, message: string): Promise<void> {
    try {
      await this.client.messages.create({
        from: this.fromNumber,
        to: `whatsapp:${to}`,
        body: message,
      });
      console.log(`WhatsApp message sent to ${to}`);
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      throw new Error('WhatsApp notification failed');
    }
  }
}

export default new WhatsAppService();