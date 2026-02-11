import type { Request, Response } from "express";
import { forgotPasswordVerifyOtpSchema } from "../../../schemas/auth/forgot-password/forgot-password-verify-otp";
import { forgotPasswordVerifyOtpService } from "../../../services/auth/forgot-password/forgot-password-verify-otp";

export async function forgotPasswordVerifyOtpController(req: Request, res: Response) {
    const parsed = forgotPasswordVerifyOtpSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const result = await forgotPasswordVerifyOtpService(parsed.data);

    if (result.status === "invalid") {
        return res.status(400).json({ message: "Your OTP is either invalid or expired." });
    }

    return res.status(200).json({
        message: "OTP verified successfully.",
        token: result.token,
    });
}
