"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeDetailsController = changeDetailsController;
const change_details_1 = require("../../schemas/settings/change-details");
const change_details_2 = require("../../services/settings/change-details");
async function changeDetailsController(req, res) {
    const parsed = change_details_1.changeDetailsSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }
    const authUser = req.user;
    const result = await (0, change_details_2.changeDetailsService)(authUser.email, parsed.data);
    if (result.status === "user_not_found") {
        return res.status(401).json({ message: "User not found." });
    }
    if (result.status === "no_changes") {
        return res.status(400).json({ message: "No changes were made." });
    }
    return res.status(200).json({ message: "Details updated successfully." });
}
