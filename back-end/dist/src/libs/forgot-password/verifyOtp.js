"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = verifyOtp;
const crypto_1 = __importDefault(require("crypto"));
function verifyOtp(inputOtp, storedOtpHash) {
    const inputHash = crypto_1.default.createHash("sha256")
        .update(`${inputOtp}:${process.env.OTP_SECRET}`)
        .digest("hex");
    const bufferInputOtp = Buffer.from(inputHash, 'hex');
    const bufferStoredOtp = Buffer.from(storedOtpHash, 'hex');
    return crypto_1.default.timingSafeEqual(bufferInputOtp, bufferStoredOtp);
}
