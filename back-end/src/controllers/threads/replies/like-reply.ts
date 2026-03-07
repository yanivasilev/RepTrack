import type { Request, Response } from "express";
import { replyIdSchema } from "../../../schemas/threads/replies/reply-id";
import { likeReplyService } from "../../../services/threads/replies/like-reply";

export async function likeReplyController(req: Request, res: Response) {
    const user = (req as any).user;
    const parsed = replyIdSchema.safeParse(req.params);

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const { replyId } = parsed.data;

    const result = await likeReplyService(user.id, replyId);

    if (result.status === "not_found") return res.status(404).json({ message: "Reply not found." });

    return res.status(200).json({ liked: result.liked, likeCount: result.likeCount });
}
