"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseController = getExerciseController;
const get_exercise_1 = require("../../services/exercises/get-exercise");
async function getExerciseController(req, res) {
    const exerciseId = Number(req.params.exerciseId);
    if (!Number.isInteger(exerciseId) || exerciseId <= 0)
        return res.status(400).json({ message: "Invalid exercise id." });
    const result = await (0, get_exercise_1.getExerciseService)(exerciseId);
    if (result.status === "not_found")
        return res.status(404).json({ message: "Exercise not found." });
    return res.status(200).json({ exercise: result.exercise });
}
