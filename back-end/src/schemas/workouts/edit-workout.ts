import { z } from "zod";

export const editWorkoutSchema = z.object({
    startedAt: z.string().datetime().optional(),

    endedAt: z.string().datetime().optional(),

    notes: z.string().trim()
        .max(2000, "Notes must be at most 2000 characters long.")
        .optional()
})

    .refine((v) => v.startedAt !== undefined || v.endedAt !== undefined || v.notes !== undefined, {
        message: "No changes detected.",
        path: ["notes"],
    });
