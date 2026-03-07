import { z } from "zod";
import { saveWorkoutExerciseSchema } from "./save-workout-exercise";

export type SaveWorkoutType = z.infer<typeof saveWorkoutSchema>;

export const saveWorkoutSchema = z.object({
    startedAt: z.string().trim()
        .min(1, "Started at is required.")
        .datetime("Started at must be a valid ISO datetime."),

    endedAt: z.string().trim()
        .min(1, "Ended at is required.")
        .datetime("Ended at must be a valid ISO datetime."),

    durationSeconds: z.coerce.number()
        .min(1, "Duration is required.")
        .int("Duration must be a whole number (seconds).")
        .positive("Duration must be greater than 0 seconds."),

    exercises: z
        .array(saveWorkoutExerciseSchema)
        .min(1, "At least one exercise is required."),

    notes: z.string().trim().max(2000, "Notes must be at most 2000 characters long.").optional(),

}).superRefine((data, ctx) => {
    const start = new Date(data.startedAt).getTime();
    const end = new Date(data.endedAt).getTime();

    if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["endedAt"],
            message: "Ended at must be after started at.",
        });
    }

    const orderIndexes = data.exercises.map(e => e.orderIndex);

    const seen = new Map<number, number>();
    orderIndexes.forEach((n, i) => {
        const prev = seen.get(n);
        if (prev !== undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["exercises", i, "orderIndex"],
                message: `Duplicate order index ${n} (already used at index ${prev}).`,
            });
        } else {
            seen.set(n, i);
        }
    });

    const uniqueSorted = Array.from(seen.keys()).sort((a, b) => a - b);
    if (uniqueSorted.length === 0) return;

    if (uniqueSorted[0] !== 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["exercises"],
            message: "Order index must start at 0.",
        });
        return;
    }

    for (let expected = 0; expected < uniqueSorted.length; expected++) {
        if (uniqueSorted[expected] !== expected) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["exercises"],
                message: `Order index must be sequential with no gaps (missing ${expected}).`,
            });
            break;
        }
    }
});
