import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase()
        .min(1, "Email is required.")
        .email("Email must be valid.")
        .max(254, "Email is too long."),

    password: z.string()
        .min(1, "Password is required.")
        .max(72, "Password is too long.")
});

export type LoginInput = z.infer<typeof loginSchema>;
