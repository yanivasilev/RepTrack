"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeThreadController = unlikeThreadController;
const unlike_thread_1 = require("../../services/threads/unlike-thread");
async function unlikeThreadController(req, res) {
    const user = req.user;
    const threadId = Number(req.params.threadId);
    if (!Number.isInteger(threadId) || threadId <= 0)
        return res.status(400).json({ message: "Invalid thread id." });
    const result = await (0, unlike_thread_1.unlikeThreadService)(user.id, threadId);
    if (result.status === "not_found")
        return res.status(404).json({ message: "Thread not found." });
    return res.status(200).json({ liked: result.liked, likeCount: result.likeCount });
}
