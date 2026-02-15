import { z } from "zod";

export const editThreadSchema = z.object({
    title: z.string().trim()
        .min(3, "Title must be at least 3 characters.")
        .max(120, "Title must not exceed 120 characters.")
        .optional(),

    body: z.string().trim()
        .min(1, "Body is required.")
        .max(5000, "Body must not exceed 5000 characters.")
        .optional(),
})

    .refine((v) => v.title !== undefined || v.body !== undefined, {
        message: "Provide title or body to update.",
        path: ["body"],
    });
