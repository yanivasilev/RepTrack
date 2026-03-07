import { z } from "zod";
import { saveWorkoutSetSchema } from "./save-workout-set";

export const saveWorkoutExerciseSchema = z.object({
    exerciseId: z.coerce
        .number()
        .int("Exercise Id is required.")
        .positive("Exercise id cannot be negative."),

    orderIndex: z.coerce
        .number()
        .int("Order index must be a whole number.")
        .min(0, "Order index cannot be negative.")
        .default(0),

    notes: z.string().trim().max(2000, "Notes must be at most 2000 characters long.").optional(),

    sets: z.array(saveWorkoutSetSchema).min(1, "At least one set is required."),

}).superRefine((data, ctx) => {
    const setNumbers = data.sets.map((s) => s.setNumber);

    const seen = new Map<number, number>();
    setNumbers.forEach((n, i) => {
        const prevIndex = seen.get(n);
        if (prevIndex !== undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["sets", i, "setNumber"],
                message: `Duplicate setNumber ${n} (already used in set ${prevIndex + 1}).`,
            });
        } else {
            seen.set(n, i);
        }
    });

    const uniqueSorted = Array.from(seen.keys()).sort((a, b) => a - b);
    if (uniqueSorted.length === 0) return;

    if (uniqueSorted[0] !== 1) {
        const idx = seen.get(uniqueSorted[0])!;
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sets", idx, "setNumber"],
            message: "Set number must start at 1.",
        });
        return;
    }

    for (let expected = 1; expected <= uniqueSorted.length; expected++) {
        if (uniqueSorted[expected - 1] !== expected) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["sets"],
                message: `Set number must be sequential with no gaps (missing ${expected}).`,
            });
            break;
        }
    }
});