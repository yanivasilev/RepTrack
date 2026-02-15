import { z } from "zod";

export const createReplySchema = z.object({
    body: z.string().trim()
        .min(1, "Reply body is required.")
        .max(2000, "Reply body must not exceed 2000 characters."),
});
