import { z } from "zod";

export const updateWorkoutExerciseSchema = z.object({
    exerciseId: z.number().int().positive().optional(), // USE TO CHANGE THE CURRENT EXERCISE TYPE
    orderIndex: z.number().int().min(0).optional(), // USE TO ARRANGE THE ORDER IN THE UI IN THE FRONTEND
    notes: z.string().trim().max(1000, "Notes must be at most 1000 characters long.").optional(),
})

    .refine((v) => v.exerciseId !== undefined || v.orderIndex !== undefined || v.notes !== undefined, {
        message: "No changes detected.",
        path: ["notes"],
    });
