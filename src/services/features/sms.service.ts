import axios from 'axios';

class SMSService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    // Replace with your SMS gateway API details
    this.apiUrl = process.env.SMS_API_URL || 'https://example-sms-gateway.com/send';
    this.apiKey = process.env.SMS_API_KEY || 'your_api_key';
  }

  // Send an SMS
  async sendSMS(to: string, message: string): Promise<void> {
    try {
      const response = await axios.post(this.apiUrl, {
        apiKey: this.apiKey,
        to,
        message,
      });

      if (response.data.status !== 'success') {
        throw new Error(`SMS sending failed: ${response.data.message}`);
      }

      console.log(`SMS sent to ${to}`);
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new Error('SMS notification failed');
    }
  }
}

export default new SMSService();