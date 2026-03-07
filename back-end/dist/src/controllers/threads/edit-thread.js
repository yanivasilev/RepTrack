"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editThreadController = editThreadController;
const edit_thread_1 = require("../../schemas/threads/edit-thread");
const edit_thread_2 = require("../../services/threads/edit-thread");
async function editThreadController(req, res) {
    const user = req.user;
    const threadId = Number(req.params.threadId);
    if (!Number.isInteger(threadId) || threadId <= 0) {
        return res.status(400).json({ message: "Invalid thread id." });
    }
    const parsed = edit_thread_1.editThreadSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }
    const result = await (0, edit_thread_2.editThreadService)(user.id, threadId, parsed.data);
    if (result.status === "not_found")
        return res.status(404).json({ message: "Thread not found." });
    if (result.status === "unauthorised")
        return res.status(403).json({ message: "The thread is not yours." });
    if (result.status === "no_changes")
        return res.status(400).json({ message: "No changes detected." });
    return res.status(200).json({
        message: "Thread updated successfully.",
        thread: result.thread,
    });
}
