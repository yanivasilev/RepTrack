"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileThreadsSchema = void 0;
const zod_1 = require("zod");
exports.getProfileThreadsSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int()
        .min(1, "Page must be at least 1.")
        .default(1),
    limit: zod_1.z.coerce.number().int()
        .min(1, "Limit must be at least 1.")
        .max(10, "Limit must be between 1 and 10.")
        .default(10),
});
