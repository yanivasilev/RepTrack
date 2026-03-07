"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThreadController = createThreadController;
const create_thread_1 = require("../../schemas/threads/create-thread");
const create_thread_2 = require("../../services/threads/create-thread");
async function createThreadController(req, res) {
    const user = req.user;
    const parsed = create_thread_1.createThreadSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }
    const thread = await (0, create_thread_2.createThreadService)(user, parsed.data);
    return res.status(201).json({ message: "Thread created successfully.", thread });
}
