import type { Request, Response } from "express";
import { emailVerificationVerifyOtpSchema } from "../../../schemas/auth/email-verification/email-verification-verify-otp";
import { emailVerificationVerifyOtpService } from "../../../services/auth/email-verification/email-verification-verify-otp";

export async function emailVerificationVerifyOtpController(req: Request, res: Response) {
    const parsed = emailVerificationVerifyOtpSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const result = await emailVerificationVerifyOtpService(parsed.data);

    if (result.status === "invalid") return res.status(400).json({ message: "Your OTP is either invalid or expired." });
    if (result.status === "already_verified") return res.status(200).json({ message: "Your email is already verified." });

    return res.status(200).json({ message: "Email verified successfully." });
}
