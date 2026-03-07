"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordResetService = forgotPasswordResetService;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../../db");
const verifyFPtoken_1 = require("../../../libs/forgot-password/verifyFPtoken");
async function forgotPasswordResetService(data) {
    if (data.password !== data.confirmPassword) {
        return { status: "password_mismatch" };
    }
    // user exists?
    const user = await db_1.prisma.user.findUnique({ where: { email: data.email } });
    if (!user)
        return { status: "invalid_session" };
    // session record exists?
    const record = await db_1.prisma.forgotPasswordSession.findUnique({ where: { userId: user.id } });
    if (!record)
        return { status: "invalid_session" };
    // used/expired?
    if (record.usedAt)
        return { status: "invalid_session" };
    if (record.expiresAt <= new Date())
        return { status: "invalid_session" };
    // token matches?
    if (!(0, verifyFPtoken_1.verifyFPtoken)(data.token, record.tokenHash)) {
        return { status: "invalid_session" };
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    await db_1.prisma.$transaction([
        db_1.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        }),
        db_1.prisma.forgotPasswordSession.update({
            where: { userId: user.id },
            data: { usedAt: new Date() },
        }),
    ]);
    return { status: "ok" };
}
