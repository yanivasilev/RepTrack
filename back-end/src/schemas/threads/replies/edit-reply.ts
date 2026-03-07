import { z } from "zod";
import { replyIdSchema } from "./reply-id";

export const editReplySchema = z.object({
    params: replyIdSchema,

    body: z.string().trim()
        .min(1, "Reply body is required.")
        .max(2000, "Reply body must not exceed 2000 characters.")

});
