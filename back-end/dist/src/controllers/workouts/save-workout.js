"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWorkoutController = saveWorkoutController;
const save_workout_1 = require("../../schemas/workouts/save-workout/save-workout");
const save_workout_2 = require("../../services/workouts/save-workout");
async function saveWorkoutController(req, res) {
    const user = req.user;
    const parsed = save_workout_1.saveWorkoutSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        });
    }
    const result = await (0, save_workout_2.saveWorkoutService)(user.id, parsed.data);
    if (result.status === "invalid_exercise_id")
        return res.status(400).json({ message: "Exercise not found.", missing: result.missing });
    if (result.status === "invalid_set_for_exercise_type")
        return res.status(400).json({ message: "Invalid sets for exercise type.", errors: result.errors });
    return res.status(201).json({ message: "Workout saved successfully.", workout: result.workout, newBadges: result.newBadges });
}
