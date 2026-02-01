import { z } from "zod";
import { FitnessGoal, ExperienceLevel, TrainingStyle, TrainingFrequency } from "../../../generated/prisma/enums";

export const changeDetailsSchema = z.object({
    weight: z.coerce.number()
        .int("Weight must be a whole number.")
        .min(20, "Weight looks too small.")
        .max(635, "Weight looks too large."),

    fitnessGoal: z.nativeEnum(FitnessGoal, "Invalid fitness goal."),
    experienceLevel: z.nativeEnum(ExperienceLevel, "Invalid experience level."),
    trainingStyle: z.nativeEnum(TrainingStyle, "Invalid training style."),
    trainingFrequency: z.nativeEnum(TrainingFrequency, "Invalid training frequency."),
});

export type changeDetailsInput = z.infer<typeof changeDetailsSchema>;
