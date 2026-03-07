import type { Request, Response } from "express";
import { changeDetailsSchema } from "../../schemas/settings/change-details";
import { changeDetailsService } from "../../services/settings/change-details";

export async function changeDetailsController(req: Request, res: Response) {
    const user = (req as any).user;
    const parsed = changeDetailsSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const result = await changeDetailsService(user.id, parsed.data);

    if (result.status === "user_not_found") return res.status(401).json({ message: "User not found." });
    if (result.status === "no_changes") return res.status(400).json({ message: "No changes were made." });

    return res.status(200).json({ message: "Details updated successfully." });
}