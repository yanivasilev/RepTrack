"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllThreadsController = getAllThreadsController;
const get_all_threads_1 = require("../../services/threads/get-all-threads");
const get_all_threads_2 = require("../../schemas/threads/get-all-threads");
const avatarUrlFromFileName_1 = require("../../utils/avatarUrlFromFileName");
async function getAllThreadsController(req, res) {
    const user = req.user;
    const parsed = get_all_threads_2.getAllThreadsSchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }
    const { page, limit, query } = parsed.data;
    const result = await (0, get_all_threads_1.getAllThreadsService)(user.id, { page, limit, query });
    return res.status(200).json({
        ...result,
        items: result.items.map((item) => {
            const { avatarFileName, ...authorWithoutFile } = item.author;
            return {
                ...item,
                author: {
                    ...authorWithoutFile,
                    avatarUrl: (0, avatarUrlFromFileName_1.avatarUrlFromFileName)(req, avatarFileName),
                },
            };
        }),
    });
}
