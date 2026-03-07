import type { Request, Response } from "express";
import { threadIdSchema } from "../../schemas/threads/thread-id";
import { unlikeThreadService } from "../../services/threads/unlike-thread";

export async function unlikeThreadController(req: Request, res: Response) {
    const user = (req as any).user;
    const parsed = threadIdSchema.safeParse(req.params);

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const { threadId } = parsed.data;

    const result = await unlikeThreadService(user.id, threadId);

    if (result.status === "not_found") return res.status(404).json({ message: "Thread not found." });

    return res.status(200).json({ liked: result.liked, likeCount: result.likeCount });
}
