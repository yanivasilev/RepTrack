import type { Request, Response } from "express";
import { editThreadSchema } from "../../schemas/threads/edit-thread";
import { editThreadService } from "../../services/threads/edit-thread";

export async function editThreadController(req: Request, res: Response) {
    const user = (req as any).user;
    const threadId = Number(req.params.threadId);

    if (!Number.isInteger(threadId) || threadId <= 0) {
        return res.status(400).json({ message: "Invalid thread id." });
    }

    const parsed = editThreadSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const result = await editThreadService(user.id, threadId, parsed.data);

    if (result.status === "not_found") return res.status(404).json({ message: "Thread not found." });

    if (result.status === "unauthorised") return res.status(403).json({ message: "The thread is not yours." });

    if (result.status === "no_changes") return res.status(400).json({ message: "No changes detected." });

    return res.status(200).json({
        message: "Thread updated successfully.",
        thread: result.thread,
    });
}
