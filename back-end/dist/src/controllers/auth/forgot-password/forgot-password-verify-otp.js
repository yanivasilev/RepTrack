"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordVerifyOtpController = forgotPasswordVerifyOtpController;
const forgot_password_verify_otp_1 = require("../../../schemas/auth/forgot-password/forgot-password-verify-otp");
const forgot_password_verify_otp_2 = require("../../../services/auth/forgot-password/forgot-password-verify-otp");
async function forgotPasswordVerifyOtpController(req, res) {
    const parsed = forgot_password_verify_otp_1.forgotPasswordVerifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }
    const result = await (0, forgot_password_verify_otp_2.forgotPasswordVerifyOtpService)(parsed.data);
    if (result.status === "invalid") {
        return res.status(400).json({ message: "Your OTP is either invalid or expired." });
    }
    return res.status(200).json({
        message: "OTP verified successfully.",
        token: result.token,
    });
}
