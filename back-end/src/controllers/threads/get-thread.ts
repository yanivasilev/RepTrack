import type { Request, Response } from "express";
import { getThreadService } from "../../services/threads/get-thread";

export async function getThreadController(req: Request, res: Response) {
    const user = (req as any).user;
    const threadId = Number(req.params.threadId);

    const repliesPage = Number(req.query.repliesPage ?? 1);
    const repliesLimit = Number(req.query.repliesLimit ?? 20);

    if (!Number.isInteger(threadId) || threadId <= 0) {
        return res.status(400).json({ message: "Invalid thread id." });
    }
    if (!Number.isInteger(repliesPage) || repliesPage <= 0) {
        return res.status(400).json({ message: "Invalid replies page." });
    }
    if (!Number.isInteger(repliesLimit) || repliesLimit <= 0 || repliesLimit > 20) {
        return res.status(400).json({ message: "Invalid replies limit (1-20)." });
    }

    const result = await getThreadService(user.id, threadId, {
        page: repliesPage,
        limit: repliesLimit,
    });

    if (result.status === "not_found") return res.status(404).json({ message: "Thread not found." });

    return res.status(200).json(result.data);
}
