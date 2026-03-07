"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerificationController = emailVerificationController;
const email_verification_1 = require("../../../schemas/auth/email-verification/email-verification");
const email_verification_2 = require("../../../services/auth/email-verification/email-verification");
const emailVerificationResponse = (res) => res.status(200).json({ message: "If an account exists, your verification code has been sent." });
async function emailVerificationController(req, res) {
    const parsed = email_verification_1.emailVerificationSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }
    await (0, email_verification_2.emailVerificationService)(parsed.data.email);
    return emailVerificationResponse(res);
}
