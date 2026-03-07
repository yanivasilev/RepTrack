"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReplyController = deleteReplyController;
const delete_reply_1 = require("../../../services/threads/replies/delete-reply");
async function deleteReplyController(req, res) {
    const user = req.user;
    const replyId = Number(req.params.replyId);
    if (!Number.isInteger(replyId) || replyId <= 0)
        return res.status(400).json({ message: "Invalid reply id." });
    const result = await (0, delete_reply_1.deleteReplyService)(user.id, replyId);
    if (result.status === "not_found")
        return res.status(404).json({ message: "Reply not found." });
    if (result.status === "unauthorised")
        return res.status(403).json({ message: "The reply is not yours." });
    return res.status(200).json({ message: "Reply deleted successfully.", });
}
