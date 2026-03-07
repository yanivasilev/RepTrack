import type { Request, Response } from "express";
import { getProfileThreadsService } from "../../services/profiles/get-profile-threads";
import { getProfileThreadsSchema } from "../../schemas/profiles/get-profile-threads/get-profile-threads";

export async function getProfileThreadsController(req: Request, res: Response) {
    const user = (req as any).user;
    const parsed = getProfileThreadsSchema.safeParse({ params: req.params, query: req.query });

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const { userId: targetUserId } = parsed.data.params;
    const { page, limit } = parsed.data.query;

    const result = await getProfileThreadsService(user.id, targetUserId, { page, limit });

    if (result.status === "not_found") return res.status(404).json({ message: "User not found." });

    return res.status(200).json(result);
}
