"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeReplyController = likeReplyController;
const like_reply_1 = require("../../../services/threads/replies/like-reply");
async function likeReplyController(req, res) {
    const user = req.user;
    const replyId = Number(req.params.replyId);
    if (!Number.isInteger(replyId) || replyId <= 0)
        return res.status(400).json({ message: "Invalid reply id." });
    const result = await (0, like_reply_1.likeReplyService)(user.id, replyId);
    if (result.status === "not_found")
        return res.status(404).json({ message: "Reply not found." });
    return res.status(200).json({ liked: result.liked, likeCount: result.likeCount });
}
