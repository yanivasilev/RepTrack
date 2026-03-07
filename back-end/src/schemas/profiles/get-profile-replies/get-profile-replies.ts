import { z } from "zod";
import { getProfileRepliesQuerySchema } from "./get-profile-replies-query";

export const getProfileRepliesSchema = z.object({
    params: z.object({
        userId: z.coerce.number().int().positive("User ID is invalid."),
    }),
    query: getProfileRepliesQuerySchema,
});
