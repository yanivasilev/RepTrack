import type { Request, Response } from "express";
import { unlikeThreadService } from "../../services/threads/unlike-thread";

export async function unlikeThreadController(req: Request, res: Response) {
    const user = (req as any).user;
    const threadId = Number(req.params.threadId);

    if (!Number.isInteger(threadId) || threadId <= 0) return res.status(400).json({ message: "Invalid thread id." });

    const result = await unlikeThreadService(user.id, threadId);

    if (result.status === "not_found") return res.status(404).json({ message: "Thread not found." });

    return res.status(200).json({
        liked: result.liked,
        likeCount: result.likeCount
    });
}
