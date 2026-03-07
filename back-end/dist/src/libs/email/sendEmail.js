"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendEmail({ to, subject, text, html, attachment, attachmentFileName, attachmentCid }) {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    const attachments = attachment
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
