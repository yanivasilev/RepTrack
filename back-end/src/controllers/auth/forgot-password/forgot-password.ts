import type { Request, Response } from "express";
import { forgotPasswordSchema } from "../../../schemas/auth/forgot-password/forgot-password";
import { forgotPasswordService } from "../../../services/auth/forgot-password/forgot-password";

const forgotPasswordResponse = (res: Response) =>
    res.status(200).json({ message: "If an account exists, your verification code has been sent." });

export async function forgotPasswordController(req: Request, res: Response) {
    const parsed = forgotPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    // Always returns 200 to avoid leaking whether an email exists
    await forgotPasswordService(parsed.data.email);

    /*
    if (parsed.data.email === "test@test.com") {
        return res.status(500).json({
            message: "Forced backend error for testing (not field-related)",
        });
    }
    */

    return forgotPasswordResponse(res);
}
