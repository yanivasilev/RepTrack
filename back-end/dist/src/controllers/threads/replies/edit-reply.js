"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editReplyController = editReplyController;
const edit_reply_1 = require("../../../schemas/threads/replies/edit-reply");
const edit_reply_2 = require("../../../services/threads/replies/edit-reply");
async function editReplyController(req, res) {
    const user = req.user;
    const replyId = Number(req.params.replyId);
    if (!Number.isInteger(replyId) || replyId <= 0)
        return res.status(400).json({ message: "Invalid reply id." });
    const parsed = edit_reply_1.editReplySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }
    const result = await (0, edit_reply_2.editReplyService)(user.id, replyId, parsed.data);
    if (result.status === "not_found")
        return res.status(404).json({ message: "Reply not found." });
    if (result.status === "unauthorised")
        return res.status(403).json({ message: "The reply is not yours." });
    if (result.status === "no_changes")
        return res.status(400).json({ message: "No changes detected." });
    return res.status(200).json({ message: "Reply updated successfully.", reply: result.reply, });
}
