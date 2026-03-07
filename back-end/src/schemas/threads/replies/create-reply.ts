import { z } from "zod";
import { threadIdSchema } from "../thread-id";

export const createReplySchema = z.object({
    params: threadIdSchema,

    body: z.object({
        body: z.string().trim()
            .min(1, "Reply body is required.")
            .max(2000, "Reply body must not exceed 2000 characters."),
    })

});
