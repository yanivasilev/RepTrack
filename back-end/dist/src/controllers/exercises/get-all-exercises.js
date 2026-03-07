"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExercisesController = getAllExercisesController;
const get_all_exercises_1 = require("../../schemas/exercises/get-all-exercises");
const get_all_exercises_2 = require("../../services/exercises/get-all-exercises");
async function getAllExercisesController(req, res) {
    const parsed = get_all_exercises_1.getAllExercisesSchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }
    const { page, limit, query } = parsed.data;
    const result = await (0, get_all_exercises_2.getAllExercisesService)(page, limit, query);
    return res.status(200).json(result);
}
