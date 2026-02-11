import { z } from "zod";

export const changeAvatarSchema = z.object({
    mimetype: z.enum(["image/jpeg", "image/png", "image/webp"], "Only .JPG, .PNG and .WEBP files are allowed."),
    size: z.number().max(2 * 1024 * 1024, "File size is limited to 2 MB."), // 2MB
    filename: z.string().min(1, "File could not be saved correctly."),
    originalname: z.string().min(1, "The file requires a name."),
});