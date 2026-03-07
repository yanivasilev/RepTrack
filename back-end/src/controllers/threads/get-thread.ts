import type { Request, Response } from "express";
import { getThreadSchema } from "../../schemas/threads/get-thread";
import { getThreadService } from "../../services/threads/get-thread";

export async function getThreadController(req: Request, res: Response) {
    const user = (req as any).user;
    const parsed = getThreadSchema.safeParse({ params: req.params, query: req.query });

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const { threadId } = parsed.data.params;
    const { repliesPage, repliesLimit } = parsed.data.query;

    const result = await getThreadService(user.id, threadId, { page: repliesPage, limit: repliesLimit });

    if (result.status === "not_found") return res.status(404).json({ message: "Thread not found." });

    return res.status(200).json(result);
}
