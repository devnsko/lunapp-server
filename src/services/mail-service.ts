import nodemailer from "nodemailer";

class MailService {
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.MAIL_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD, 
        },
    });

    public async sendMail(to: string, link: string): Promise<boolean> {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Account activation on Lunapp',
                text: '',
                html: `
                    <div>
                        <h1>Click on the link to activate your account</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

export default new MailService();