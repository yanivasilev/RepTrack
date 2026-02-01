import { z } from "zod";

export const loginChangePasswordSchema = z.object({
    currentPassword: z.string()
        .min(1, "Current password is required."),

    password: z.string()
        .min(1, "Password is required.")
        .min(8, "Password must be at least 8 characters.")
        .max(72, "Password must not exceed 72 characters.")
        .regex(/[A-Za-z]/, "Password must include at least one letter.")
        .regex(/[0-9]/, "Password must include at least one number.")
        .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must include at least one special character.")
        .regex(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/, "Password must not contain illegal characters or spaces."),

    rePassword: z.string()
        .min(1, "Re-password is required.")
});

export type loginChangePasswordInput = z.infer<typeof loginChangePasswordSchema>;
