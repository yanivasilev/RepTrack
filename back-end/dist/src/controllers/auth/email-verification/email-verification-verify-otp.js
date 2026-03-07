"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerificationVerifyOtpController = emailVerificationVerifyOtpController;
const email_verification_verify_otp_1 = require("../../../schemas/auth/email-verification/email-verification-verify-otp");
const email_verification_verify_otp_2 = require("../../../services/auth/email-verification/email-verification-verify-otp");
async function emailVerificationVerifyOtpController(req, res) {
    const parsed = email_verification_verify_otp_1.emailVerificationVerifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }
    const result = await (0, email_verification_verify_otp_2.emailVerificationVerifyOtpService)(parsed.data);
    if (result.status === "invalid") {
        return res.status(400).json({ message: "Your OTP is either invalid or expired." });
    }
    if (result.status === "already_verified") {
        return res.status(200).json({ message: "Your email is already verified." });
    }
    return res.status(200).json({ message: "Email verified successfully." });
}
