"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWorkoutSetSchema = void 0;
const zod_1 = require("zod");
const emptyToUndefined = (v) => v === "" || v === null ? undefined : v;
exports.saveWorkoutSetSchema = zod_1.z.object({
    setNumber: zod_1.z.coerce.number()
        .int("Set number must be a whole number.")
        .min(1, "Set number must be at least 1."),
    reps: zod_1.z.preprocess(emptyToUndefined, zod_1.z.coerce.number()
        .int("Reps must be a whole number.")
        .min(0, "Reps cannot be negative.")
        .optional()),
    weight: zod_1.z.preprocess(emptyToUndefined, zod_1.z.coerce.number()
        .min(0, "Weight cannot be negative.")
        .optional()), // KG
    durationSeconds: zod_1.z.preprocess(emptyToUndefined, zod_1.z.coerce.number()
        .int("Duration must be a whole number (seconds).")
        .min(0, "Duration cannot be negative.")
        .optional()),
    notes: zod_1.z.string().trim()
        .max(2000, "Notes must be at most 2000 characters long.").optional()
})
    .superRefine((set, ctx) => {
    const hasReps = set.reps !== undefined;
    const hasDuration = set.durationSeconds !== undefined;
    if (hasReps && hasDuration) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["durationSeconds"],
            message: "Duration cannot be provided when reps are set.",
        });
    }
    if (!hasReps && !hasDuration) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["reps"],
            message: "Either reps or durationSeconds must be provided.",
        });
    }
});
