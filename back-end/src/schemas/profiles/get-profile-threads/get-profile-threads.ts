import { z } from "zod";
import { getProfileThreadsQuerySchema } from "./get-profile-threads-query";

export const getProfileThreadsSchema = z.object({
    params: z.object({
        userId: z.coerce.number().int().positive("User ID is invalid."),
    }),
    query: getProfileThreadsQuerySchema,
});
