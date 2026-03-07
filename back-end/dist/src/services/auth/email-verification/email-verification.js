"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerificationService = emailVerificationService;
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../../../db");
const generateOtp_1 = require("../../../libs/forgot-password/generateOtp");
const generateOtpCaptchaImage_1 = require("../../../libs/forgot-password/generateOtpCaptchaImage");
const sendEmail_1 = require("../../../libs/email/sendEmail");
const emailLimiter_1 = require("../../../middleware/emailLimiter");
async function emailVerificationService(email) {
    const emailHash = crypto_1.default.createHash("sha256").update(email).digest("hex");
    const limiterCheck = (0, emailLimiter_1.emailLimiter)(`tracker:email-verification:${emailHash}`);
    if (!limiterCheck.allowed)
        return;
    const user = await db_1.prisma.user.findUnique({
        where: { email },
        select: { id: true, emailVerifiedAt: true },
    });
    if (!user)
        return;
    if (user.emailVerifiedAt)
        return;
    const otp = (0, generateOtp_1.generateOtp)();
    const otpCaptchaImage = await (0, generateOtpCaptchaImage_1.generateOtpCaptchaImage)(otp);
    const otpSecret = process.env.OTP_SECRET;
    if (!otpSecret)
        return;
    const otpHash = crypto_1.default.createHash("sha256").update(`${otp}:${otpSecret}`).digest("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await db_1.prisma.emailVerificationOtp.upsert({
        where: { userId: user.id },
        update: {
            otpHash,
            expiresAt,
            usedAt: null,
            attempts: 0,
        },
        create: {
            userId: user.id,
            otpHash,
            expiresAt,
        },
    });
    await (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Verify your email address",
        text: `
Your verification code is shown in the image in this email.
This code expires in 5 minutes.
If you did not create this account, you can safely ignore this email.
`.trim(),
        html: `
<div style="background:#F2F2F7;padding:24px;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
    style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial;">
    <tr>
      <td style="background:#34C759;padding:18px 20px;">
        <div style="color:#ffffff;font-size:18px;font-weight:700;">
          Verify your email address
        </div>
        <div style="color:#eafff1;font-size:13px;opacity:0.95;margin-top:4px;">
          Use this code to complete your account setup
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:20px;">
        <div style="color:#111827;font-size:14px;line-height:20px;">
          Enter the verification code shown below:
        </div>

        <div style="margin-top:14px;text-align:center;">
          <img src="cid:otp-image" alt="Verification code"
            style="display:block;margin:0 auto;max-width:100%;
            border:1px solid #E5E7EB;border-radius:12px;" />
        </div>

        <div style="margin-top:14px;color:#6B7280;font-size:12px;line-height:18px;">
          This code expires in 5 minutes.
        </div>
      </td>
    </tr>

    <tr>
      <td style="padding:14px 20px;border-top:1px solid #E5E7EB;color:#9CA3AF;font-size:12px;text-align:center;">
        © Rep<span style="color:#34C759">Track</span>
      </td>
    </tr>
  </table>
</div>
`.trim(),
        attachment: otpCaptchaImage,
        attachmentFileName: "verification-code.png",
        attachmentCid: "otp-image",
    });
}
