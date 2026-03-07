import type { Request, Response } from "express";
import { createReplySchema } from "../../../schemas/threads/replies/create-reply";
import { createReplyService } from "../../../services/threads/replies/create-reply";

export async function createReplyController(req: Request, res: Response) {
    const user = (req as any).user;
    const parsed = createReplySchema.safeParse({ params: req.params, body: req.body });

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const { threadId } = parsed.data.params;
    const result = await createReplyService(user.id, threadId, parsed.data.body.body);

    if (result.status === "not_found") return res.status(404).json({ message: "Thread not found." });

    return res.status(201).json({ message: "Reply created successfully.", reply: result.reply });
}
