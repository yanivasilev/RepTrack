import { z } from "zod";

export const createThreadSchema = z.object({
    title: z.string().trim()
        .min(3, "Title must be at least 3 characters.")
        .max(120, "Title must not exceed 120 characters."),

    body: z.string().trim()
        .min(1, "Body is required.")
        .max(5000, "Body must not exceed 5000 characters.")
});
