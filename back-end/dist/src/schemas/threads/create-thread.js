"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThreadSchema = void 0;
const zod_1 = require("zod");
exports.createThreadSchema = zod_1.z.object({
    title: zod_1.z.string().trim()
        .min(3, "Title must be at least 3 characters.")
        .max(120, "Title must not exceed 120 characters."),
    body: zod_1.z.string().trim()
        .min(1, "Body is required.")
        .max(5000, "Body must not exceed 5000 characters.")
});
