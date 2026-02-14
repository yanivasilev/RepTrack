import type { Request, Response } from "express";
import { deleteThreadService } from "../../services/threads/delete-thread";

export async function deleteThreadController(req: Request, res: Response) {
    const user = (req as any).user;
    const threadId = Number(req.params.threadId);

    if (!Number.isInteger(threadId) || threadId <= 0) return res.status(400).json({ message: "Invalid thread id." });

    const result = await deleteThreadService(user.id, threadId);

    if (result.status === "not_found") {
        return res.status(404).json({ message: "Thread not found." });
    }

    if (result.status === "unauthorised") {
        return res.status(403).json({ message: "The thread is not yours." });
    }


    return res.status(200).json({ message: "Thread deleted successfully." });
}
