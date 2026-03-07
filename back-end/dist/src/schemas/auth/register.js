"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../../generated/prisma/enums");
const calculateAge_1 = require("../../utils/calculateAge");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase()
        .min(1, "Email is required.")
        .email("Email must be valid.")
        .max(254, "Email is too long."),
    password: zod_1.z.string()
        .min(1, "Password is required.")
        .min(8, "Password must be at least 8 characters.")
        .max(72, "Password must not exceed 72 characters.")
        .regex(/[A-Za-z]/, "Password must include at least one letter.")
        .regex(/[0-9]/, "Password must include at least one number.")
        .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must include at least one special character.")
        .regex(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/, "Password must not contain illegal characters or spaces."),
    confirmPassword: zod_1.z.string()
        .min(1, "Confirm password is required."),
    username: zod_1.z.string().trim().toLowerCase()
        .min(1, "Username is required.")
        .min(3, "Username must be at least 3 characters.")
        .max(20, "Username must not exceed 20 characters.")
        .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])?$/, "Username can only contain letters, numbers, '.' and '_'."),
    dob: zod_1.z.coerce.date()
        .refine((dob) => !isNaN(dob.getTime()), "Date of birth must be a valid date.")
        .refine((dob) => (0, calculateAge_1.calculateAge)(dob) >= 18, "You must be 18 or over.")
        .refine((dob) => (0, calculateAge_1.calculateAge)(dob) <= 120, "Age looks invalid."),
    sex: zod_1.z.nativeEnum(enums_1.Sex, "Invalid sex."),
    height: zod_1.z.coerce.number()
        .int("Height must be a whole number.")
        .min(99, "Height looks too small.")
        .max(240, "Height looks too large."),
    weight: zod_1.z.coerce.number()
        .int("Weight must be a whole number.")
        .min(30, "Weight looks too small.")
        .max(350, "Weight looks too large."),
    fitnessGoal: zod_1.z.nativeEnum(enums_1.FitnessGoal, "Fitness goal is invalid."),
    experienceLevel: zod_1.z.nativeEnum(enums_1.ExperienceLevel, "Experience level is invalid."),
    trainingStyle: zod_1.z.nativeEnum(enums_1.TrainingStyle, "Training style is invalid."),
    trainingFrequency: zod_1.z.nativeEnum(enums_1.TrainingFrequency, "Training frequency is invalid."),
    heightUnitType: zod_1.z.nativeEnum(enums_1.UnitType, "Unit type is invalid."),
    weightUnitType: zod_1.z.nativeEnum(enums_1.UnitType, "Unit type is invalid."),
});
