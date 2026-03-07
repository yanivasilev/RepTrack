import { z } from "zod";

export const threadIdSchema = z.object({
    threadId: z.coerce.number().int().positive("Invalid thread id."),
});
