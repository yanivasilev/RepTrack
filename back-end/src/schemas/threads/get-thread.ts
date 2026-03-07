import { z } from "zod";
import { threadIdSchema } from "./thread-id";

export const getThreadSchema = z.object({
    params: threadIdSchema,
    query: z.object({
        repliesPage: z.coerce.number().int().positive("Invalid replies page.").default(1),
        repliesLimit: z.coerce.number().int().min(1, "Invalid replies limit (1-10).").max(10, "Invalid replies limit (1-10).").default(10),
    }),
});
