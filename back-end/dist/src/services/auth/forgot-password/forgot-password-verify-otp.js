"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordVerifyOtpService = forgotPasswordVerifyOtpService;
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../../../db");
const verifyOtp_1 = require("../../../libs/forgot-password/verifyOtp");
const generateForgotPasswordToken_1 = require("../../../libs/forgot-password/generateForgotPasswordToken");
const MAX_ATTEMPTS = 5;
const SESSION_EXPIRES_MS = 5 * 60 * 1000; // 5 minutes
async function forgotPasswordVerifyOtpService(data) {
    // user exists?
    const user = await db_1.prisma.user.findUnique({ where: { email: data.email } });
    if (!user)
        return { status: "invalid" };
    // otp record exists?
    const record = await db_1.prisma.forgotPasswordOtp.findUnique({ where: { userId: user.id } });
    if (!record)
        return { status: "invalid" };
    // used / expired / attempts exceeded?
    if (record.usedAt)
        return { status: "invalid" };
    if (record.expiresAt <= new Date())
        return { status: "invalid" };
    if (record.attempts >= MAX_ATTEMPTS)
        return { status: "invalid" };
    // otp matches?
    const ok = (0, verifyOtp_1.verifyOtp)(data.otp, record.otpHash);
    if (!ok) {
        // increment attempts on wrong OTP
        await db_1.prisma.forgotPasswordOtp.update({
            where: { userId: user.id },
            data: { attempts: { increment: 1 } },
        });
        return { status: "invalid" };
    }
    // generate reset-session token
    const token = crypto_1.default.randomBytes(32).toString("hex");
    const tokenHash = (0, generateForgotPasswordToken_1.generateForgotPasswordToken)(token);
    const expiresAt = new Date(Date.now() + SESSION_EXPIRES_MS);
    // do updates together
    await db_1.prisma.$transaction([
        db_1.prisma.forgotPasswordOtp.update({
            where: { userId: user.id },
            data: { usedAt: new Date() },
        }),
        db_1.prisma.forgotPasswordSession.upsert({
            where: { userId: user.id },
            update: { tokenHash, expiresAt, usedAt: null },
            create: { userId: user.id, tokenHash, expiresAt },
        }),
    ]);
    return { status: "ok", token };
}
