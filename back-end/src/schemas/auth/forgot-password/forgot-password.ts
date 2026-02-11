import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.string().trim().toLowerCase()
        .min(1, "Email is required.")
        .email("Email must be valid.")
        .max(254, "Email is too long."),
});