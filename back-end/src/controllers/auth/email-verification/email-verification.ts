import type { Request, Response } from "express";
import { emailVerificationSchema } from "../../../schemas/auth/email-verification/email-verification";
import { emailVerificationService } from "../../../services/auth/email-verification/email-verification";

export async function emailVerificationController(req: Request, res: Response) {
    const parsed = emailVerificationSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const result = await emailVerificationService(parsed.data.email);

    if (result.status === "invalid") return res.status(200).json({ message: "If an account exists, your verification code has been sent." });
    if (result.status === "already_verified") return res.status(200).json({ message: "Your email is already verified." });

    return res.status(200).json({ message: "If an account exists, your verification code has been sent." });
}
