import { z } from "zod";
import { exerciseAnalysisFileSchema } from "./exercise-analysis-file";

export const exerciseAnalysisSchema = z.object({
    params: z.object({
        exerciseId: z.coerce.number().int().positive("Invalid exercise id."),
    }),

    file: z.any().refine((value) => Boolean(value), "Missing video file.").pipe(exerciseAnalysisFileSchema),
});
