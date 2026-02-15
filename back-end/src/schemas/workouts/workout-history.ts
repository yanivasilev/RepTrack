import { z } from "zod";

export const workoutHistorySchema = z.object({
    page: z.coerce.number().int()
        .min(1, "Page must be at least 1.")
        .default(1),

    limit: z.coerce.number().int()
        .min(1, "Limit must be at least 1.")
        .max(20, "Limit must be between 1 and 20.")
        .default(20),

    from: z.string().datetime().optional(),

    to: z.string().datetime().optional(),

    sort: z.enum(["latest", "oldest"]).optional(),
});
