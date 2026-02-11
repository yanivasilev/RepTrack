import nodemailer from "nodemailer";

type sendEmailProps = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    attachment?: Buffer;
    attachmentFileName?: string;
    attachmentCid?: string;
}

export async function sendEmail({ to, subject, text, html, attachment, attachmentFileName, attachmentCid }: sendEmailProps) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const attachments =
        attachment
            ? [
                {
                    filename: attachmentFileName ?? "attachment.png",
                    content: attachment,
                    cid: attachmentCid,
                },
            ]
            : undefined;

    const email = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: to,
        subject: subject,
        text: text,
        html: html,
        attachments
    });

    return email.messageId;

}