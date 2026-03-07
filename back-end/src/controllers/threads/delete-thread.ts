import type { Request, Response } from "express";
import { threadIdSchema } from "../../schemas/threads/thread-id";
import { deleteThreadService } from "../../services/threads/delete-thread";

export async function deleteThreadController(req: Request, res: Response) {
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

    const result = await deleteThreadService(user.id, threadId);

    if (result.status === "not_found") return res.status(404).json({ message: "Thread not found." });
    if (result.status === "unauthorised") return res.status(403).json({ message: "The thread is not yours." });

    return res.status(200).json({ message: "Thread deleted successfully." });
}
