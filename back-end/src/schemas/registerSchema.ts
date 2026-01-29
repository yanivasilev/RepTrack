import { z } from "zod";
import { Gender, FitnessGoal, ExperienceLevel, TrainingStyle, TrainingFrequency } from "../../generated/prisma/enums";

export const registerSchema = z.object({
    email: z.string().trim().toLowerCase()
        .min(1, "Email is required.")
        .email("Email must be valid.")
        .max(254, "Email is too long."),

    password: z.string()
        .min(1, "Password is required.")
        .min(8, "Password must be at least 8 characters.")
        .max(72, "Password must not exceed 72 characters.")
        .regex(/[A-Za-z]/, "Password must include at least one letter.")
        .regex(/[0-9]/, "Password must include at least one number.")
        .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must include at least one special character.")
        .regex(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/, "Password must not contain illegal characters or spaces."),

    username: z.string().trim().toLowerCase()
        .min(3, "Username must be at least 3 characters.")
        .max(20, "Username must not exceed 20 characters.")
        .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])?$/, "Username can only contain letters, numbers, '.' and '_'."),

    age: z.coerce.number()
        .int("Age must be a whole number.")
        .min(18, "You must 18 or over.")
        .max(120, "Age looks invalid."),

    gender: z.nativeEnum(Gender, "Invalid gender."),

    height: z.coerce.number()
        .int("Height must be a whole number.")
        .min(50, "Height looks too small.")
        .max(272, "Height looks too large."),

    weight: z.coerce.number()
        .int("Weight must be a whole number.")
        .min(20, "Weight looks too small.")
        .max(635, "Weight looks too large."),

    fitnessGoal: z.nativeEnum(FitnessGoal, "Invalid fitness goal."),
    experienceLevel: z.nativeEnum(ExperienceLevel, "Invalid experience level."),
    trainingStyle: z.nativeEnum(TrainingStyle, "Invalid training style."),
    trainingFrequency: z.nativeEnum(TrainingFrequency, "Invalid training frequency."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
