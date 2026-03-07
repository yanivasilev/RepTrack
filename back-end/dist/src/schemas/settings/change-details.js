"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeDetailsSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../../generated/prisma/enums");
exports.changeDetailsSchema = zod_1.z.object({
    weight: zod_1.z.coerce.number()
        .int("Weight must be a whole number.")
        .min(20, "Weight looks too small.")
        .max(635, "Weight looks too large."),
    weightUnitType: zod_1.z.nativeEnum(enums_1.UnitType, "Unit type is invalid."),
    heightUnitType: zod_1.z.nativeEnum(enums_1.UnitType, "Unit type is invalid."),
    fitnessGoal: zod_1.z.nativeEnum(enums_1.FitnessGoal, "Fitness goal is invalid."),
    experienceLevel: zod_1.z.nativeEnum(enums_1.ExperienceLevel, "Experience level is invalid."),
    trainingStyle: zod_1.z.nativeEnum(enums_1.TrainingStyle, "Training style is invalid."),
    trainingFrequency: zod_1.z.nativeEnum(enums_1.TrainingFrequency, "Training frequency is invalid.")
});
