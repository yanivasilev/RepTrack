"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProfilesController = getAllProfilesController;
const avatarUrlFromFileName_1 = require("../../utils/avatarUrlFromFileName");
const get_all_profiles_1 = require("../../schemas/profiles/get-all-profiles");
const get_all_profiles_2 = require("../../services/profiles/get-all-profiles");
async function getAllProfilesController(req, res) {
    const parsed = get_all_profiles_1.getAllProfilesSchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }
    const { page, limit, query } = parsed.data;
    const result = await (0, get_all_profiles_2.getAllProfilesService)(page, limit, query);
    return res.status(200).json({
        ...result,
        items: result.items.map((profile) => {
            const { avatarFileName, ...safe } = profile;
            return {
                ...safe,
                avatarUrl: (0, avatarUrlFromFileName_1.avatarUrlFromFileName)(req, avatarFileName),
            };
        }),
    });
}
