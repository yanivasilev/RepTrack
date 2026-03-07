"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordVerifyOtpSchema = void 0;
const zod_1 = require("zod");
exports.forgotPasswordVerifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase()
        .min(1, "Email is required.")
        .email("Email must be valid.")
        .max(254, "Email is too long."),
    otp: zod_1.z.string().trim()
        .min(1, "OTP is required.")
        .max(6, "OTP is too long.")
});
