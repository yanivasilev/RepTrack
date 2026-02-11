import multer from "multer";

export const uploadVideo = multer({
    dest: "uploads/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});
