"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReplySchema = void 0;
const zod_1 = require("zod");
exports.createReplySchema = zod_1.z.object({
    body: zod_1.z.string().trim()
        .min(1, "Reply body is required.")
        .max(2000, "Reply body must not exceed 2000 characters."),
});
