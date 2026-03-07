"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutHistoryController = workoutHistoryController;
const workout_history_1 = require("../../schemas/workouts/workout-history");
const workout_history_2 = require("../../services/workouts/workout-history");
async function workoutHistoryController(req, res) {
    const user = req.user;
    const parsed = workout_history_1.workoutHistorySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        });
    }
    const page = parsed.data.page ?? 1;
    const limit = parsed.data.limit ?? 10;
    const sort = parsed.data.sort ?? "latest";
    const result = await (0, workout_history_2.workoutHistoryService)(user.id, {
        page,
        limit,
        from: parsed.data.from,
        to: parsed.data.to,
        sort,
    });
    return res.status(200).json(result);
}
