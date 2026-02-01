import type { Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../db";
import { forgotPasswordVerifySchema } from "../schemas/forgotPasswordVerifySchema";
import { verifyOTP } from "../services/verifyOTP";
import { generateForgotPasswordToken } from "../services/generateForgotPasswordToken";

export async function forgotPasswordVerify(req: Request, res: Response) {
    const parsed = forgotPasswordVerifySchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const data = parsed.data;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(400).json("Your OTP is either invalid or expired.");

    // Check if user has OTP records
    const record = await prisma.forgotPasswordOtp.findUnique({ where: { userId: user?.id } })
    if (!record) return res.status(400).json("Your OTP is either invalid or expired.");

    // Already used code
    if (record.usedAt) return res.status(400).json("Your OTP is either invalid or expired.");

    // Expired code
    if (record.expiresAt <= new Date()) return res.status(400).json("Your OTP is either invalid or expired.");

    const MAX_ATTEMPTS = 5;
    if (record.attempts >= MAX_ATTEMPTS) return res.status(400).json("Your OTP is either invalid or expired.");

    const storedOtpHash = record.otpHash;

    if (!verifyOTP(data.otp, storedOtpHash)) {
        // Increase attempts on wrong OTP
        await prisma.forgotPasswordOtp.update({
            where: { userId: user.id },
            data: { attempts: { increment: 1 } }
        });

        return res.status(400).json("Your OTP is either invalid or expired.");
    }


    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = generateForgotPasswordToken(token);

    // Marking as used
    await prisma.forgotPasswordOtp.update({
        where: { userId: user.id },
        data: { usedAt: new Date() }
    });

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 MINUTES

    // Creating a token session
    await prisma.forgotPasswordSession.upsert({
        where: { userId: user.id },
        update: {
            tokenHash,
            expiresAt,
            usedAt: null,
        },
        create: {
            userId: user.id,
            tokenHash,
            expiresAt,
        },
    });

    return res.status(200).json({
        message: "OTP verified successfully.",
        token
    });
}
