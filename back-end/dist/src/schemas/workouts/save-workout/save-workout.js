"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWorkoutSchema = void 0;
const zod_1 = require("zod");
const save_workout_exercise_1 = require("./save-workout-exercise");
exports.saveWorkoutSchema = zod_1.z.object({
    startedAt: zod_1.z.string().trim()
        .min(1, "Started at is required.")
        .datetime("Started at must be a valid ISO datetime."),
    endedAt: zod_1.z.string().trim()
        .min(1, "Ended at is required.")
        .datetime("Ended at must be a valid ISO datetime."),
    durationSeconds: zod_1.z.coerce.number()
        .min(1, "Duration is required.")
        .int("Duration must be a whole number (seconds).")
        .positive("Duration must be greater than 0 seconds."),
    exercises: zod_1.z
        .array(save_workout_exercise_1.saveWorkoutExerciseSchema)
        .min(1, "At least one exercise is required."),
    notes: zod_1.z.string().trim().max(2000, "Notes must be at most 2000 characters long.").optional(),
})
    .superRefine((data, ctx) => {
    const start = new Date(data.startedAt).getTime();
    const end = new Date(data.endedAt).getTime();
    if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["endedAt"],
            message: "Ended at must be after started at.",
        });
    }
    const orderIndexes = data.exercises.map(e => e.orderIndex);
    const seen = new Map();
    orderIndexes.forEach((n, i) => {
        const prev = seen.get(n);
        if (prev !== undefined) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ["exercises", i, "orderIndex"],
                message: `Duplicate order index ${n} (already used at index ${prev}).`,
            });
        }
        else {
            seen.set(n, i);
        }
    });
    const uniqueSorted = Array.from(seen.keys()).sort((a, b) => a - b);
    if (uniqueSorted.length === 0)
        return;
    if (uniqueSorted[0] !== 0) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["exercises"],
            message: "Order index must start at 0.",
        });
        return;
    }
    for (let expected = 0; expected < uniqueSorted.length; expected++) {
        if (uniqueSorted[expected] !== expected) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ["exercises"],
                message: `Order index must be sequential with no gaps (missing ${expected}).`,
            });
            break;
        }
    }
});
