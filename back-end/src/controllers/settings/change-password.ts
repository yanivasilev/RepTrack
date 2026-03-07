import type { Request, Response } from "express";
import { changePasswordSchema } from "../../schemas/settings/change-password";
import { changePasswordService } from "../../services/settings/change-password";

export async function changePasswordController(req: Request, res: Response) {
    const user = (req as any).user;
    const parsed = changePasswordSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const result = await changePasswordService(user.id, parsed.data);

    if (result.status === "user_not_found") return res.status(401).json({ message: "User not found." });
    if (result.status === "bad_current") return res.status(400).json({ message: "Current password is invalid." });
    if (result.status === "mismatch") return res.status(400).json({ message: "New password and new confirm password must match." });
    if (result.status === "same") return res.status(400).json({ message: "New password must be different from current password." });

    return res.status(200).json({ message: "Password updated successfully." });
}
