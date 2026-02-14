import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { emailLimiterCleanup } from "./middleware/emailLimiterCleanup";
import { ipLimiter } from "./middleware/ipLimiter";
import { requireLoggedOut } from "./middleware/requireLoggedOut";
import { requireLoggedIn } from "./middleware/requireLoggedIn";
import type { Request, Response, NextFunction } from "express";
import { changeAvatarMiddleware } from "./middleware/changeAvatarMiddleware";
import multer from "multer";
import path from "path";
import { changeDetailsController } from "./controllers/settings/change-details";
import { changePasswordController } from "./controllers/settings/change-password";
import { changeUsernameController } from "./controllers/settings/change-username";
import { meController } from "./controllers/me";
import { changeAvatarController } from "./controllers/settings/change-avatar";
import { registerController } from "./controllers/auth/register";
import { loginController } from "./controllers/auth/login";
import { forgotPasswordController } from "./controllers/auth/forgot-password/forgot-password";
import { forgotPasswordResetController } from "./controllers/auth/forgot-password/forgot-password-reset";
import { forgotPasswordVerifyOtpController } from "./controllers/auth/forgot-password/forgot-password-verify-otp";
import { uploadVideo } from "./middleware/uploadVideo";
import { analyzePushupVideo } from "./controllers/poseController";
import { createThreadController } from "./controllers/threads/create-thread";
import { deleteThreadController } from "./controllers/threads/delete-thread";
import { editThreadController } from "./controllers/threads/edit-thread";
import { getAllThreadsController } from "./controllers/threads/get-all-threads";
import { getThreadController } from "./controllers/threads/get-thread";
import { likeThreadController } from "./controllers/threads/like-thread";
import { unlikeThreadController } from "./controllers/threads/unlike-thread";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("API running: "));

// OTHER ROUTES
app.get("/auth/check", requireLoggedIn, (_req, res) => { res.status(200).json({ ok: true }); });

///////////////////////
// LOGGED OUT ROUTES //
///////////////////////
app.post("/auth/login", requireLoggedOut, loginController);
app.post("/auth/register", requireLoggedOut, registerController);

app.post("/auth/forgot-password", requireLoggedOut, ipLimiter("If an account exists, your verification code has been sent."), forgotPasswordController);
app.post("/auth/forgot-password/verify", requireLoggedOut, forgotPasswordVerifyOtpController);
app.post("/auth/forgot-password/reset", requireLoggedOut, forgotPasswordResetController);

//////////////////////
// LOGGED IN ROUTES //
//////////////////////
app.put("/settings/change-details", requireLoggedIn, changeDetailsController);
app.put("/settings/change-password", requireLoggedIn, changePasswordController);
app.put("/settings/change-username", requireLoggedIn, changeUsernameController);
app.put("/settings/change-avatar", requireLoggedIn, changeAvatarMiddleware.single("avatar"), changeAvatarController);
app.get("/me", requireLoggedIn, meController);

// THREADS
app.post("/threads", requireLoggedIn, createThreadController);
app.delete("/threads/:threadId", requireLoggedIn, deleteThreadController);
app.patch("/threads/edit/:threadId", requireLoggedIn, editThreadController);
app.get("/threads", requireLoggedIn, getAllThreadsController);
app.get("/threads/:threadId", requireLoggedIn, getThreadController);
app.post("/threads/:threadId/like", requireLoggedIn, likeThreadController);
app.delete("/threads/:threadId/like", requireLoggedIn, unlikeThreadController);

// TESTING POSE DETECTION
app.post("/pushup", uploadVideo.single("video"), analyzePushupVideo);

app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    // MULTER ERROR FOR WHEN FILE IS TOO LARGE
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                message: "File size is limited to 2 MB."
            });
        }

        return res.status(400).json({
            message: err.message
        });
    }

    // MULTI-PART ERRORSS (CLIENT INTERRUPTED UPLOAD OR BAD FORM-DATA)
    if (err?.message === "Unexpected end of form.") {
        return res.status(400).json({
            message: "File upload was interrupted or form-data was malformed.",
        });
    }

    next(err);
});

// GLOBAL UNHANDLED ERROR
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("UNHANDLED ERROR:", err);

    res.status(err.statusCode || 500).json({
        message: "Something went wrong. Please try again.",
    });
});

emailLimiterCleanup();

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Node.JS Server running: http://localhost:${port}`));