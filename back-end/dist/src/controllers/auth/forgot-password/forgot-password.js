"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordController = forgotPasswordController;
const forgot_password_1 = require("../../../schemas/auth/forgot-password/forgot-password");
const forgot_password_2 = require("../../../services/auth/forgot-password/forgot-password");
const forgotPasswordResponse = (res) => res.status(200).json({ message: "If an account exists, your verification code has been sent." });
async function forgotPasswordController(req, res) {
    const parsed = forgot_password_1.forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }
    // Always returns 200 to avoid leaking whether an email exists
    await (0, forgot_password_2.forgotPasswordService)(parsed.data.email);
    return forgotPasswordResponse(res);
}
