import { z } from "zod";

export const replyIdSchema = z.object({
    replyId: z.coerce.number().int().positive("Invalid reply id."),
});
