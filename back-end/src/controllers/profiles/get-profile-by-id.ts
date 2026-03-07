import type { Request, Response } from "express";
import { getProfileByIdService } from "../../services/profiles/get-profile-by-id";
import { getProfileByIdSchema } from "../../schemas/profiles/get-profile-by-id";

export async function getProfileByIdController(req: Request, res: Response) {
    const user = (req as any).user;
    const parsed = getProfileByIdSchema.safeParse(req.params);

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const { userId } = parsed.data;

    const result = await getProfileByIdService(user.id, userId);

    if (result.status === "not_found") return res.status(404).json({ message: "User not found." });

    return res.status(200).json(result);
}
