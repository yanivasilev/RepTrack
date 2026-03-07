"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutSuggestionSchema = void 0;
const zod_1 = require("zod");
exports.workoutSuggestionSchema = zod_1.z.object({
    exerciseId: zod_1.z.coerce.number().int()
        .min(1, "Exercise ID must be at least 1."),
});
