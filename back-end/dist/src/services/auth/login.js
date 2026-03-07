"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = loginService;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../db");
async function loginService(data) {
    const user = await db_1.prisma.user.findUnique({ where: { email: data.email } });
    if (!user)
        return { status: "invalid" };
    const ok = await bcrypt_1.default.compare(data.password, user.password);
    if (!ok)
        return { status: "invalid" };
    if (!user.emailVerifiedAt)
        return { status: "email_not_verified" };
    const secret = process.env.JWT_SECRET;
    if (!secret)
        return { status: "server_error" };
    const accessToken = jsonwebtoken_1.default.sign({ sub: String(user.id), email: user.email }, secret, {
        expiresIn: "7d",
    });
    return { status: "ok", accessToken };
}
