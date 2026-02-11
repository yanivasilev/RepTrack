import { z } from "zod";
import { FitnessGoal, ExperienceLevel, TrainingStyle, TrainingFrequency, UnitType } from "../../../generated/prisma/enums";

export const changeDetailsSchema = z.object({
    weight: z.coerce.number()
        .int("Weight must be a whole number.")
        .min(20, "Weight looks too small.")
        .max(635, "Weight looks too large."),
    weightUnitType: z.nativeEnum(UnitType, "Unit type is invalid."),

    fitnessGoal: z.nativeEnum(FitnessGoal, "Fitness goal is invalid."),
    experienceLevel: z.nativeEnum(ExperienceLevel, "Experience level is invalid."),
    trainingStyle: z.nativeEnum(TrainingStyle, "Training style is invalid."),
    trainingFrequency: z.nativeEnum(TrainingFrequency, "Training frequency is invalid.")
});