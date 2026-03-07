import { z } from "zod";

export const emailVerificationVerifyOtpSchema = z.object({
    email: z.string().trim().toLowerCase()
        .min(1, "Email is required.")
        .email("Email must be valid.")
        .max(254, "Email is too long."),

    otp: z.string().trim()
        .min(1, "OTP is required.")
        .max(6, "OTP is too long."),
});
