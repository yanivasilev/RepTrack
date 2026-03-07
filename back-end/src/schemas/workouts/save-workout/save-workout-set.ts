import { z } from "zod";

const emptyToUndefined = (v: unknown) => v === "" || v === null ? undefined : v;

export const saveWorkoutSetSchema = z.object({
    setNumber: z.coerce.number()
        .int("Set number must be a whole number.")
        .min(1, "Set number must be at least 1."),

    reps: z.preprocess(emptyToUndefined, z.coerce.number()
        .int("Reps must be a whole number.")
        .min(0, "Reps cannot be negative.")
        .optional()),

    weight: z.preprocess(emptyToUndefined, z.coerce.number()
        .min(0, "Weight cannot be negative.")
        .optional()), // KG

    durationSeconds: z.preprocess(emptyToUndefined, z.coerce.number()
        .int("Duration must be a whole number (seconds).")
        .min(0, "Duration cannot be negative.")
        .optional()),

    notes: z.string().trim()
        .max(2000, "Notes must be at most 2000 characters long.").optional()

}).superRefine((set, ctx) => {
    const hasReps = set.reps !== undefined;
    const hasDuration = set.durationSeconds !== undefined;

    if (hasReps && hasDuration) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["durationSeconds"],
            message: "Duration cannot be provided when reps are set.",
        });
    }

    if (!hasReps && !hasDuration) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["reps"],
            message: "Either reps or durationSeconds must be provided.",
        });
    }
});