"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutHistorySchema = void 0;
const zod_1 = require("zod");
exports.workoutHistorySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int()
        .min(1, "Page must be at least 1.")
        .default(1),
    limit: zod_1.z.coerce.number().int()
        .min(1, "Limit must be at least 1.")
        .max(20, "Limit must be between 1 and 20.")
        .default(20),
    from: zod_1.z.string().datetime().optional(),
    to: zod_1.z.string().datetime().optional(),
    sort: zod_1.z.enum(["latest", "oldest"]).optional(),
});
