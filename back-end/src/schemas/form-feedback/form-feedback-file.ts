import z from "zod";

export const formFeedbackFileSchema = z.object({
    path: z.string()
        .min(1, "Video file path is missing."),

    mimetype: z.enum(["video/mp4", "video/quicktime", "video/webm"], "Only .MP4, .MOV and .WEBM video files are allowed."),

    size: z.number()
        .max(50 * 1024 * 1024, "Video file size is limited to 50 MB."),

    filename: z.string()
        .min(1, "Video file could not be saved correctly."),

    originalname: z.string()
        .min(1, "The video requires a name."),

});