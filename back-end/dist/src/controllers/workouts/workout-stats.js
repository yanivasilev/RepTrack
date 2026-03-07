"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutStatsController = workoutStatsController;
const workout_stats_1 = require("../../services/workouts/workout-stats");
async function workoutStatsController(req, res) {
    const user = req.user;
    const result = await (0, workout_stats_1.workoutStatsService)(user.id);
    return res.status(200).json(result);
}
