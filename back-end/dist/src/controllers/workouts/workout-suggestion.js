"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutSuggestionController = workoutSuggestionController;
const workout_suggestion_1 = require("../../services/workouts/workout-suggestion");
async function workoutSuggestionController(req, res) {
    const user = req.user;
    const exerciseId = Number(req.params.exerciseId);
    if (!Number.isInteger(exerciseId) || exerciseId <= 0) {
        return res.status(400).json({ message: "Invalid exercise id." });
    }
    const result = await (0, workout_suggestion_1.workoutSuggestionService)(user.id, { exerciseId });
    if (result.status === "exercise_not_found")
        return res.status(404).json({ message: "Exercise not found." });
    return res.status(200).json(result.suggestion);
}
