import { z } from "zod";

export const getProfileByIdSchema = z.object({
    userId: z.coerce.number().int().positive("User ID is invalid."),
});
