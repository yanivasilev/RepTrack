import { z } from "zod";
import { formFeedbackFileSchema } from "./form-feedback-file";

export const formFeedbackSchema = z.object({
    params: z.object({
        exerciseId: z.coerce.number().int().positive("Invalid exercise id."),
    }),

    file: z.any().refine((value) => Boolean(value), "Missing video file.").pipe(formFeedbackFileSchema),
});
