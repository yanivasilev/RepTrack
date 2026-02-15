import type { Request, Response } from "express";
import { editReplySchema } from "../../../schemas/threads/replies/edit-reply";
import { editReplyService } from "../../../services/threads/replies/edit-reply";

export async function editReplyController(req: Request, res: Response) {
    const user = (req as any).user;
    const replyId = Number(req.params.replyId);

    if (!Number.isInteger(replyId) || replyId <= 0) return res.status(400).json({ message: "Invalid reply id." });

    const parsed = editReplySchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const result = await editReplyService(user.id, replyId, parsed.data);

    if (result.status === "not_found") return res.status(404).json({ message: "Reply not found." });

    if (result.status === "unauthorised") return res.status(403).json({ message: "The reply is not yours." });

    if (result.status === "no_changes") return res.status(400).json({ message: "No changes detected." });

    return res.status(200).json({ message: "Reply updated successfully.", reply: result.reply, });
}
