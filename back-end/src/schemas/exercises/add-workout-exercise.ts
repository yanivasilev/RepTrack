import { z } from "zod";

export const addWorkoutExerciseSchema = z.object({
    exerciseId: z.number().int()
        .positive("Exercise id must be a positive number."),

    orderIndex: z.number().int()
        .min(0).optional(),

    notes: z.string().trim()
        .max(1000, "Notes must be at most 1000 characters long.").optional()
});
