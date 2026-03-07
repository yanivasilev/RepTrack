"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileThreadsController = getProfileThreadsController;
const avatarUrlFromFileName_1 = require("../../utils/avatarUrlFromFileName");
const get_profile_threads_1 = require("../../services/profiles/get-profile-threads");
const get_profile_threads_2 = require("../../schemas/profiles/get-profile-threads");
async function getProfileThreadsController(req, res) {
    const user = req.user;
    const targetUserId = Number(req.params.userId);
    if (!Number.isInteger(targetUserId) || targetUserId <= 0)
        return res.status(400).json({ message: "User ID is invalid." });
    const parsed = get_profile_threads_2.getProfileThreadsSchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }
    const { page, limit } = parsed.data;
    const result = await (0, get_profile_threads_1.getProfileThreadsService)(user.id, targetUserId, { page, limit });
    if (result.status === "not_found")
        return res.status(404).json({ message: "User not found." });
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
