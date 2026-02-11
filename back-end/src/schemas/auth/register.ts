import { z } from "zod";
import { Sex, FitnessGoal, ExperienceLevel, TrainingStyle, TrainingFrequency, UnitType } from "../../../generated/prisma/enums";
import { calculateAge } from "../../utils/calculateAge";

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

    confirmPassword: z.string()
        .min(1, "Confirm password is required."),

    username: z.string().trim().toLowerCase()
        .min(1, "Username is required.")
        .min(3, "Username must be at least 3 characters.")
        .max(20, "Username must not exceed 20 characters.")
        .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])?$/, "Username can only contain letters, numbers, '.' and '_'."),

    dob: z.coerce.date()
        .refine((dob) => !isNaN(dob.getTime()), "Date of birth must be a valid date.")
        .refine((dob) => calculateAge(dob) >= 18, "You must be 18 or over.")
        .refine((dob) => calculateAge(dob) <= 120, "Age looks invalid."),

    sex: z.nativeEnum(Sex, "Invalid sex."),

    height: z.coerce.number()
        .int("Height must be a whole number.")
        .min(50, "Height looks too small.")
        .max(272, "Height looks too large."),

    weight: z.coerce.number()
        .int("Weight must be a whole number.")
        .min(20, "Weight looks too small.")
        .max(635, "Weight looks too large."),

    fitnessGoal: z.nativeEnum(FitnessGoal, "Fitness goal is invalid."),
    experienceLevel: z.nativeEnum(ExperienceLevel, "Experience level is invalid."),
    trainingStyle: z.nativeEnum(TrainingStyle, "Training style is invalid."),
    trainingFrequency: z.nativeEnum(TrainingFrequency, "Training frequency is invalid."),
    heightUnitType: z.nativeEnum(UnitType, "Unit type is invalid."),
    weightUnitType: z.nativeEnum(UnitType, "Unit type is invalid."),
});