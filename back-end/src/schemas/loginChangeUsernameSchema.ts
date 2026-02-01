import { z } from "zod";

export const loginChangeUsernameSchema = z.object({
    currentUsername: z.string().trim().toLowerCase()
        .min(1, "Current username is required."),

    newUsername: z.string().trim().toLowerCase()
        .min(3, "Username must be at least 3 characters.")
        .max(20, "Username must not exceed 20 characters.")
        .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])?$/, "Username can only contain letters, numbers, '.' and '_'.")
});

export type loginChangeUsernameInput = z.infer<typeof loginChangeUsernameSchema>;
