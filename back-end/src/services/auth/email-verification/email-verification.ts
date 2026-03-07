import crypto from "crypto";
import { prisma } from "../../../db";
import { generateOtp } from "../../../libs/forgot-password/generateOtp";
import { generateOtpCaptchaImage } from "../../../libs/forgot-password/generateOtpCaptchaImage";
import { sendEmail } from "../../../libs/email/sendEmail";

export async function emailVerificationService(email: string) {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, emailVerifiedAt: true } });

  // CHECKS IF USER EXISTS AND IF ALREADY VERIFIED
  if (!user) return { status: "invalid" as const };
  if (user.emailVerifiedAt) return { status: "already_verified" as const };

  // GENERATES OTP
  const otp = generateOtp();
  const otpCaptchaImage = await generateOtpCaptchaImage(otp);

  // HASHES OTP
  const otpSecret = process.env.OTP_SECRET;
  const otpHash = crypto.createHash("sha256").update(`${otp}:${otpSecret}`).digest("hex");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // UPDATES DB
  await prisma.emailVerificationOtp.upsert({
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

  // SENDS EMAIL
  await sendEmail({
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

  return { status: "ok" as const };
}
