import { z } from "zod";

export const workoutIdSchema = z.object({
    workoutId: z.coerce.number().int().positive("Invalid workout id."),
});
