import type { Request, Response } from "express";
import { forgotPasswordSchema } from "../../../schemas/auth/forgot-password/forgot-password";
import { forgotPasswordService } from "../../../services/auth/forgot-password/forgot-password";

export async function forgotPasswordController(req: Request, res: Response) {
    const parsed = forgotPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const result = await forgotPasswordService(parsed.data.email);

    if (result.status === "invalid") return res.status(200).json({ message: "If an account exists, your verification code has been sent." });

    return res.status(200).json({ message: "If an account exists, your verification code has been sent." });
}
