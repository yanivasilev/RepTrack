"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThreadController = getThreadController;
const get_thread_1 = require("../../services/threads/get-thread");
const avatarUrlFromFileName_1 = require("../../utils/avatarUrlFromFileName");
async function getThreadController(req, res) {
    const user = req.user;
    const threadId = Number(req.params.threadId);
    const repliesPage = Number(req.query.repliesPage ?? 1);
    const repliesLimit = Number(req.query.repliesLimit ?? 20);
    if (!Number.isInteger(threadId) || threadId <= 0)
        return res.status(400).json({ message: "Invalid thread id." });
    if (!Number.isInteger(repliesPage) || repliesPage <= 0)
        return res.status(400).json({ message: "Invalid replies page." });
    if (!Number.isInteger(repliesLimit) || repliesLimit <= 0 || repliesLimit > 10)
        return res.status(400).json({ message: "Invalid replies limit (1-10)." });
    const result = await (0, get_thread_1.getThreadService)(user.id, threadId, {
        page: repliesPage,
        limit: repliesLimit,
    });
    if (result.status === "not_found")
        return res.status(404).json({ message: "Thread not found." });
    const author = result.thread.author;
    const { avatarFileName, ...authorWithoutFile } = author;
    const repliesItems = result.replies.items.map((r) => {
        const { avatarFileName, ...authorWithoutFile } = r.author;
        return {
            ...r,
            author: {
                ...authorWithoutFile,
                avatarUrl: (0, avatarUrlFromFileName_1.avatarUrlFromFileName)(req, avatarFileName),
            },
        };
    });
    return res.status(200).json({
        ...result,
        thread: {
            ...result.thread,
            author: {
                ...authorWithoutFile,
                avatarUrl: (0, avatarUrlFromFileName_1.avatarUrlFromFileName)(req, avatarFileName),
            },
        },
        replies: {
            ...result.replies,
            items: repliesItems,
        },
    });
}
