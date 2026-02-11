import type { Request, Response } from "express";
import { changeAvatarSchema } from "../../schemas/settings/change-avatar";
import { changeAvatarService } from "../../services/settings/change-avatar";

export async function changeAvatarController(req: Request, res: Response) {
    const user = (req as any).user;

    if (!req.file) {
        return res.status(400).json({ message: "Missing file." });
    }

    const parsed = changeAvatarSchema.safeParse(req.file);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const newFilename = req.file.filename;

    await changeAvatarService(user, newFilename);

    return res.status(200).json({ message: "Avatar updated successfully." });
}
