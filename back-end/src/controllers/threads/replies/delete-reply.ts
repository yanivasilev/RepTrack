import type { Request, Response } from "express";
import { replyIdSchema } from "../../../schemas/threads/replies/reply-id";
import { deleteReplyService } from "../../../services/threads/replies/delete-reply";

export async function deleteReplyController(req: Request, res: Response) {
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

    const result = await deleteReplyService(user.id, replyId);

    if (result.status === "not_found") return res.status(404).json({ message: "Reply not found." });
    if (result.status === "unauthorised") return res.status(403).json({ message: "The reply is not yours." });

    return res.status(200).json({ message: "Reply deleted successfully.", });
}
