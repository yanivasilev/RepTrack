"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerificationVerifyOtpService = emailVerificationVerifyOtpService;
const db_1 = require("../../../db");
const verifyOtp_1 = require("../../../libs/forgot-password/verifyOtp");
const MAX_ATTEMPTS = 5;
async function emailVerificationVerifyOtpService(data) {
    const user = await db_1.prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true, emailVerifiedAt: true },
    });
    if (!user)
        return { status: "invalid" };
    if (user.emailVerifiedAt)
        return { status: "already_verified" };
    const record = await db_1.prisma.emailVerificationOtp.findUnique({
        where: { userId: user.id },
    });
    if (!record)
        return { status: "invalid" };
    if (record.usedAt)
        return { status: "invalid" };
    if (record.expiresAt <= new Date())
        return { status: "invalid" };
    if (record.attempts >= MAX_ATTEMPTS)
        return { status: "invalid" };
    const ok = (0, verifyOtp_1.verifyOtp)(data.otp, record.otpHash);
    if (!ok) {
        await db_1.prisma.emailVerificationOtp.update({
            where: { userId: user.id },
            data: { attempts: { increment: 1 } },
        });
        return { status: "invalid" };
    }
    await db_1.prisma.$transaction([
        db_1.prisma.emailVerificationOtp.update({
            where: { userId: user.id },
            data: { usedAt: new Date() },
        }),
        db_1.prisma.user.update({
            where: { id: user.id },
            data: { emailVerifiedAt: new Date() },
        }),
    ]);
    return { status: "ok" };
}
