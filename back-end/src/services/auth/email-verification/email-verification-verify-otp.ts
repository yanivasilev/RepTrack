import { prisma } from "../../../db";
import { verifyOtp } from "../../../libs/forgot-password/verifyOtp";

const MAX_ATTEMPTS = 5;

export async function emailVerificationVerifyOtpService(data: { email: string; otp: string }) {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true, emailVerifiedAt: true },
    });

    if (!user) return { status: "invalid" as const };
    if (user.emailVerifiedAt) return { status: "already_verified" as const };

    const record = await prisma.emailVerificationOtp.findUnique({
        where: { userId: user.id },
    });

    if (!record) return { status: "invalid" as const };
    if (record.usedAt) return { status: "invalid" as const };
    if (record.expiresAt <= new Date()) return { status: "invalid" as const };
    if (record.attempts >= MAX_ATTEMPTS) return { status: "invalid" as const };

    const ok = verifyOtp(data.otp, record.otpHash);

    if (!ok) {
        await prisma.emailVerificationOtp.update({
            where: { userId: user.id },
            data: { attempts: { increment: 1 } },
        });

        return { status: "invalid" as const };
    }

    await prisma.$transaction([
        prisma.emailVerificationOtp.update({
            where: { userId: user.id },
            data: { usedAt: new Date() },
        }),
        prisma.user.update({
            where: { id: user.id },
            data: { emailVerifiedAt: new Date() },
        }),
    ]);

    return { status: "ok" as const };
}
