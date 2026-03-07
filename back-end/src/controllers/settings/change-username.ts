import type { Request, Response } from "express";
import { changeUsernameSchema } from "../../schemas/settings/change-username";
import { changeUsernameService } from "../../services/settings/change-username";

export async function changeUsernameController(req: Request, res: Response) {
    const user = (req as any).user;
    const parsed = changeUsernameSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const result = await changeUsernameService(user.id, parsed.data);

    if (result.status === "user_not_found") return res.status(401).json({ message: "User not found." });
    if (result.status === "cooldown") return res.status(403).json({ message: result.message });
    if (result.status === "bad_current") return res.status(400).json({ message: "New username must be different from your current one." });
    if (result.status === "taken") return res.status(409).json({ message: "Username is already taken." });

    return res.status(200).json({ message: "Username updated successfully." });
}
