import type { Request, Response } from "express";
import { changeAvatarSchema } from "../../schemas/settings/change-avatar";
import { changeAvatarService } from "../../services/settings/change-avatar";

export async function changeAvatarController(req: Request, res: Response) {
    const user = (req as any).user;
    const parsed = changeAvatarSchema.safeParse({ file: req.file });

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const newFilename = parsed.data.file.filename;

    const result = await changeAvatarService(user.id, newFilename);

    if (result.status === "user_not_found") return res.status(401).json({ message: "User not found." });

    return res.status(200).json({ message: "Avatar updated successfully." });
}
