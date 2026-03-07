import { z } from "zod";

export const getProfileRepliesQuerySchema = z.object({
    page: z.coerce.number().int()
        .min(1, "Page must be at least 1.")
        .default(1),

    limit: z.coerce.number().int()
        .min(1, "Limit must be at least 1.")
        .max(10, "Limit must be between 1 and 10.")
        .default(10),
});