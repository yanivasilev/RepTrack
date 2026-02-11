import crypto from "crypto";
import { prisma } from "../../../db";
import { verifyOtp } from "../../../libs/forgot-password/verifyOtp";
import { generateForgotPasswordToken } from "../../../libs/forgot-password/generateForgotPasswordToken";

const MAX_ATTEMPTS = 5;
const SESSION_EXPIRES_MS = 5 * 60 * 1000; // 5 minutes

export async function forgotPasswordVerifyOtpService(data: { email: string; otp: string }) {
    // user exists?
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return { status: "invalid" as const };

    // otp record exists?
    const record = await prisma.forgotPasswordOtp.findUnique({ where: { userId: user.id } });
    if (!record) return { status: "invalid" as const };

    // used / expired / attempts exceeded?
    if (record.usedAt) return { status: "invalid" as const };
    if (record.expiresAt <= new Date()) return { status: "invalid" as const };
    if (record.attempts >= MAX_ATTEMPTS) return { status: "invalid" as const };

    // otp matches?
    const ok = verifyOtp(data.otp, record.otpHash);

    if (!ok) {
        // increment attempts on wrong OTP
        await prisma.forgotPasswordOtp.update({
            where: { userId: user.id },
            data: { attempts: { increment: 1 } },
        });

        return { status: "invalid" as const };
    }

    // generate reset-session token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = generateForgotPasswordToken(token);
    const expiresAt = new Date(Date.now() + SESSION_EXPIRES_MS);

    // do updates together
    await prisma.$transaction([
        prisma.forgotPasswordOtp.update({
            where: { userId: user.id },
            data: { usedAt: new Date() },
        }),
        prisma.forgotPasswordSession.upsert({
            where: { userId: user.id },
            update: { tokenHash, expiresAt, usedAt: null },
            create: { userId: user.id, tokenHash, expiresAt },
        }),
    ]);

    return { status: "ok" as const, token };
}
