import type { Request, Response } from "express";
import { forgotPasswordResetService } from "../../../services/auth/forgot-password/forgot-password-reset";
import { forgotPasswordResetSchema } from "../../../schemas/auth/forgot-password/forgot-password-reset";

export async function forgotPasswordResetController(req: Request, res: Response) {
    const parsed = forgotPasswordResetSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const result = await forgotPasswordResetService(parsed.data);

    if (result.status === "password_mismatch") return res.status(400).json({ message: "Password and confirm password must match." });
    if (result.status === "invalid_session") return res.status(400).json({ message: "Your reset password session is either invalid or expired." });

    return res.status(200).json({ message: "Your password was changed successfully." });
}
