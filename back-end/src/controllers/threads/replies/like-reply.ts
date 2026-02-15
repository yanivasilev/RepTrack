import type { Request, Response } from "express";
import { likeReplyService } from "../../../services/threads/replies/like-reply";

export async function likeReplyController(req: Request, res: Response) {
    const user = (req as any).user;
    const replyId = Number(req.params.replyId);

    if (!Number.isInteger(replyId) || replyId <= 0) return res.status(400).json({ message: "Invalid reply id." });

    const result = await likeReplyService(user.id, replyId);

    if (result.status === "not_found") return res.status(404).json({ message: "Reply not found." });

    return res.status(200).json({ liked: result.liked, likeCount: result.likeCount });
}
