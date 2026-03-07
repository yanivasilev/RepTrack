import { z } from "zod";

export const getExerciseSchema = z.object({
    exerciseId: z.coerce.number().int().positive("Invalid exercise id."),
});
