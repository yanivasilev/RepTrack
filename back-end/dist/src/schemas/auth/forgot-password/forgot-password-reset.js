"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordResetSchema = void 0;
const zod_1 = require("zod");
exports.forgotPasswordResetSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase()
        .min(1, "Email is required.")
        .email("Email must be valid.")
        .max(254, "Email is too long."),
    token: zod_1.z.string().trim()
        .min(1, "Token is required.")
        .max(64, "Token is too long."),
    password: zod_1.z.string()
        .min(1, "Password is required.")
        .min(8, "Password must be at least 8 characters.")
        .max(72, "Password must not exceed 72 characters.")
        .regex(/[A-Za-z]/, "Password must include at least one letter.")
        .regex(/[0-9]/, "Password must include at least one number.")
        .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must include at least one special character.")
        .regex(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/, "Password must not contain illegal characters or spaces."),
    confirmPassword: zod_1.z.string()
        .min(1, "Confirm password is required.")
});
