"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReplyController = createReplyController;
const create_reply_1 = require("../../../schemas/threads/replies/create-reply");
const create_reply_2 = require("../../../services/threads/replies/create-reply");
const avatarUrlFromFileName_1 = require("../../../utils/avatarUrlFromFileName");
async function createReplyController(req, res) {
    const user = req.user;
    const threadId = Number(req.params.threadId);
    if (!Number.isInteger(threadId) || threadId <= 0)
        return res.status(400).json({ message: "Invalid thread id." });
    const parsed = create_reply_1.createReplySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }
    const result = await (0, create_reply_2.createReplyService)(user.id, threadId, parsed.data.body);
    if (result.status === "not_found")
        return res.status(404).json({ message: "Thread not found." });
    const author = result.reply.author;
    const { avatarFileName, ...authorWithoutFile } = author;
    return res.status(201).json({
        message: "Reply created successfully.",
        reply: {
            ...result.reply,
            author: {
                ...authorWithoutFile,
                avatarUrl: (0, avatarUrlFromFileName_1.avatarUrlFromFileName)(req, avatarFileName),
            },
        }
    });
}
