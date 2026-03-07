"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordResetController = forgotPasswordResetController;
const forgot_password_reset_1 = require("../../../services/auth/forgot-password/forgot-password-reset");
const forgot_password_reset_2 = require("../../../schemas/auth/forgot-password/forgot-password-reset");
async function forgotPasswordResetController(req, res) {
    const parsed = forgot_password_reset_2.forgotPasswordResetSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }
    const result = await (0, forgot_password_reset_1.forgotPasswordResetService)(parsed.data);
    if (result.status === "password_mismatch") {
        // 400 is more typical than 409, but keep your style if you prefer
        return res.status(409).json({ message: "Password and confirm password must match." });
    }
    if (result.status === "invalid_session") {
        return res.status(400).json({ message: "Your reset password session is either invalid or expired." });
    }
    return res.status(200).json({ message: "Your password was changed successfully." });
}
