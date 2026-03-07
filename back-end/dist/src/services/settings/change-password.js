"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordService = changePasswordService;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../db");
async function changePasswordService(email, data) {
    const user = await db_1.prisma.user.findUnique({
        where: { email },
        select: { password: true },
    });
    if (!user)
        return { status: "user_not_found" };
    const ok = await bcrypt_1.default.compare(data.currentPassword, user.password);
    if (!ok)
        return { status: "bad_current" };
    if (data.newPassword !== data.newConfirmPassword)
        return { status: "mismatch" };
    if (data.currentPassword === data.newPassword)
        return { status: "same" };
    const hashedPassword = await bcrypt_1.default.hash(data.newPassword, 10);
    await db_1.prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
    });
    return { status: "updated" };
}
