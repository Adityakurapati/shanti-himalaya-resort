import nodemailer from 'nodemailer';

export interface EmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  tripInterest?: string;
  travelDates?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendContactEmail(data: EmailData): Promise<boolean> {
    try {
      // Email to Shanti Himalaya
      const adminMailOptions: nodemailer.SendMailOptions = {
        from: `"Shanti Himalaya Contact" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER, // shantihimalayas@gmail.com
        replyTo: data.email,
        subject: `New Contact Form: ${data.subject}`,
        html: this.generateAdminEmailHTML(data),
        text: this.generateAdminEmailText(data),
      };

      // Email to user (confirmation)
      const userMailOptions: nodemailer.SendMailOptions = {
        from: `"Shanti Himalaya" <${process.env.GMAIL_USER}>`,
        to: data.email,
        subject: 'Thank you for contacting Shanti Himalaya',
        html: this.generateUserEmailHTML(data),
        text: this.generateUserEmailText(data),
      };

      // Send both emails
      await Promise.all([
        this.transporter.sendMail(adminMailOptions),
        this.transporter.sendMail(userMailOptions),
      ]);

      console.log('Emails sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  private generateAdminEmailHTML(data: EmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; margin-top: 5px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>Shanti Himalaya Adventures</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">From:</div>
              <div class="value">${data.name} &lt;${data.email}&gt;</div>
            </div>
            
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.phone || 'Not provided'}</div>
            </div>
            
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${data.subject}</div>
            </div>
            
            ${data.tripInterest ? `
            <div class="field">
              <div class="label">Trip Interest:</div>
              <div class="value">${data.tripInterest}</div>
            </div>
            ` : ''}
            
            ${data.travelDates ? `
            <div class="field">
              <div class="label">Travel Dates:</div>
              <div class="value">${data.travelDates}</div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="value" style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div class="footer">
              <p>This email was sent from the contact form on Shanti Himalaya website.</p>
              <p>Reply to: ${data.email}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAdminEmailText(data: EmailData): string {
    return `
      NEW CONTACT FORM SUBMISSION
      ============================
      
      From: ${data.name} <${data.email}>
      Phone: ${data.phone || 'Not provided'}
      Subject: ${data.subject}
      ${data.tripInterest ? `Trip Interest: ${data.tripInterest}` : ''}
      ${data.travelDates ? `Travel Dates: ${data.travelDates}` : ''}
      
      Message:
      ${data.message}
      
      ---
      Sent from Shanti Himalaya contact form
      Reply to: ${data.email}
    `;
  }

  private generateUserEmailHTML(data: EmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
          .highlight { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196F3; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px; }
          .contact-info { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Contacting Shanti Himalaya!</h1>
            <p>Your Himalayan Adventure Awaits</p>
          </div>
          <div class="content">
            <p>Dear <strong>${data.name}</strong>,</p>
            
            <p>Thank you for reaching out to Shanti Himalaya Adventures! We have received your inquiry and our team will get back to you within <strong>24 hours</strong>.</p>
            
            <div class="highlight">
              <p><strong>Your Inquiry Details:</strong></p>
              <p>Subject: ${data.subject}</p>
              ${data.tripInterest ? `<p>Trip Interest: ${data.tripInterest}</p>` : ''}
              ${data.travelDates ? `<p>Travel Dates: ${data.travelDates}</p>` : ''}
            </div>
            
            <p>In the meantime, you can:</p>
            <ul>
              <li>Browse our adventure packages on our website</li>
              <li>Follow us on social media for latest updates</li>
              <li>Check out our blog for travel tips and stories</li>
            </ul>
            
            <div class="contact-info">
              <p><strong>Quick Contact Information:</strong></p>
              <p>📞 Phone: +91-99107 75073 (9AM-6PM IST)</p>
              <p>📧 Email: info@shantihimalaya.com</p>
              <p>📍 Office: Kotdwar, Uttarakhand, India</p>
            </div>
            
            <p>We're excited to help you plan your unforgettable Himalayan journey!</p>
            
            <p>Best regards,<br>
            <strong>The Shanti Himalaya Team</strong></p>
            
            <div class="footer">
              <p>Shanti Himalaya Adventures | Kotdwar, Uttarakhand, India</p>
              <p>Website: www.shantihimalaya.com | Email: info@shantihimalaya.com</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateUserEmailText(data: EmailData): string {
    return `
      THANK YOU FOR CONTACTING SHANTI HIMALAYA!
      =========================================
      
      Dear ${data.name},
      
      Thank you for reaching out to Shanti Himalaya Adventures! 
      We have received your inquiry and our team will get back to you within 24 hours.
      
      Your Inquiry Details:
      --------------------
      Subject: ${data.subject}
      ${data.tripInterest ? `Trip Interest: ${data.tripInterest}` : ''}
      ${data.travelDates ? `Travel Dates: ${data.travelDates}` : ''}
      
      In the meantime, you can:
      - Browse our adventure packages on our website
      - Follow us on social media for latest updates
      - Check out our blog for travel tips and stories
      
      Quick Contact Information:
      -------------------------
      Phone: +91-99107 75073 (9AM-6PM IST)
      Email: info@shantihimalaya.com
      Office: Kotdwar, Uttarakhand, India
      
      We're excited to help you plan your unforgettable Himalayan journey!
      
      Best regards,
      The Shanti Himalaya Team
      
      ---
      Shanti Himalaya Adventures
      Kotdwar, Uttarakhand, India
      Website: www.shantihimalaya.com
      Email: info@shantihimalaya.com
      
      This is an automated message. Please do not reply to this email.
    `;
  }
}

// Create a singleton instance
const emailService = new EmailService();
export default emailService;