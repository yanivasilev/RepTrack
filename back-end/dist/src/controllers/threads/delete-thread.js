"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteThreadController = deleteThreadController;
const delete_thread_1 = require("../../services/threads/delete-thread");
async function deleteThreadController(req, res) {
    const user = req.user;
    const threadId = Number(req.params.threadId);
    if (!Number.isInteger(threadId) || threadId <= 0)
        return res.status(400).json({ message: "Invalid thread id." });
    const result = await (0, delete_thread_1.deleteThreadService)(user.id, threadId);
    if (result.status === "not_found")
        return res.status(404).json({ message: "Thread not found." });
    if (result.status === "unauthorised")
        return res.status(403).json({ message: "The thread is not yours." });
    return res.status(200).json({ message: "Thread deleted successfully." });
}
