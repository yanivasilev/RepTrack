"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkoutController = deleteWorkoutController;
const delete_workout_1 = require("../../services/workouts/delete-workout");
async function deleteWorkoutController(req, res) {
    const user = req.user;
    const workoutId = Number(req.params.workoutId);
    if (!Number.isInteger(workoutId) || workoutId <= 0)
        return res.status(400).json({ message: "Invalid workout id." });
    const result = await (0, delete_workout_1.deleteWorkoutService)(user.id, workoutId);
    if (result.status === "not_found")
        return res.status(404).json({ message: "Workout not found." });
    if (result.status === "unauthorised")
        return res.status(403).json({ message: "Not allowed." });
    return res.status(200).json({ message: "Workout deleted successfully." });
}
