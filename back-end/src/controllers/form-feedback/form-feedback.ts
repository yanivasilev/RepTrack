import { Request, Response } from "express";
import { formFeedbackSchema } from "../../schemas/form-feedback/form-feedback";
import { formFeedbackService } from "../../services/form-feedback/formFeedbackService";

export async function formFeedbackController(req: Request, res: Response) {
    const parsed = formFeedbackSchema.safeParse({ params: req.params, file: (req as any).file });

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const { exerciseId } = parsed.data.params;
    const file = parsed.data.file;

    const video = {
        uri: file.path,
        fileName: file.originalname,
        mimeType: file.mimetype,
    };

    const result = await formFeedbackService(exerciseId, video);

    if (result.status === "not_found") return res.status(404).json({ message: "Exercise not found." });
    if (result.status === "exercise_not_supported") return res.status(404).json({ message: "Push-up is currently only supported." });

    return res.status(200).json(result);
}
