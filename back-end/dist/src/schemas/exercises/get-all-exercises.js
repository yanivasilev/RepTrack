"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExercisesSchema = void 0;
const zod_1 = require("zod");
exports.getAllExercisesSchema = zod_1.z.object({
    query: zod_1.z.string().trim()
        .max(100, "Query must be at most 100 characters long.")
        .optional(),
    page: zod_1.z.coerce.number().int()
        .min(1, "Page must be at least 1.")
        .default(1),
    limit: zod_1.z.coerce.number().int()
        .min(1, "Limit must be at least 1.")
        .max(20, "Limit must be between 1 and 20.")
        .default(20),
});
