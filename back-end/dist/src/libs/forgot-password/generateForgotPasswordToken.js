"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateForgotPasswordToken = generateForgotPasswordToken;
const crypto_1 = __importDefault(require("crypto"));
function generateForgotPasswordToken(token) {
    const tokenHash = crypto_1.default.createHash("sha256").update(`${token}:${process.env.FP_TOKEN_SECRET}`).digest("hex");
    return tokenHash;
}
