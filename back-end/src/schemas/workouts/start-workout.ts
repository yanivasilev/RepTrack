import { z } from "zod";

export const startWorkoutSchema = z.object({
    startedAt: z.string().datetime().optional(),
    notes: z.string().trim()
        .max(2000, "Notes must be at most 2000 characters long.")
        .optional()
});
