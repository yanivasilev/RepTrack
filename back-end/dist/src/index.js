"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const emailLimiterCleanup_1 = require("./middleware/emailLimiterCleanup");
const ipLimiter_1 = require("./middleware/ipLimiter");
const requireLoggedOut_1 = require("./middleware/requireLoggedOut");
const requireLoggedIn_1 = require("./middleware/requireLoggedIn");
const changeAvatarMiddleware_1 = require("./middleware/changeAvatarMiddleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const change_details_1 = require("./controllers/settings/change-details");
const change_password_1 = require("./controllers/settings/change-password");
const change_username_1 = require("./controllers/settings/change-username");
const change_avatar_1 = require("./controllers/settings/change-avatar");
const register_1 = require("./controllers/auth/register");
const login_1 = require("./controllers/auth/login");
const forgot_password_1 = require("./controllers/auth/forgot-password/forgot-password");
const forgot_password_reset_1 = require("./controllers/auth/forgot-password/forgot-password-reset");
const forgot_password_verify_otp_1 = require("./controllers/auth/forgot-password/forgot-password-verify-otp");
const email_verification_1 = require("./controllers/auth/email-verification/email-verification");
const email_verification_verify_otp_1 = require("./controllers/auth/email-verification/email-verification-verify-otp");
const uploadVideo_1 = require("./middleware/uploadVideo");
const poseController_1 = require("./controllers/poseController");
const create_thread_1 = require("./controllers/threads/create-thread");
const delete_thread_1 = require("./controllers/threads/delete-thread");
const edit_thread_1 = require("./controllers/threads/edit-thread");
const get_all_threads_1 = require("./controllers/threads/get-all-threads");
const get_thread_1 = require("./controllers/threads/get-thread");
const like_thread_1 = require("./controllers/threads/like-thread");
const unlike_thread_1 = require("./controllers/threads/unlike-thread");
const create_reply_1 = require("./controllers/threads/replies/create-reply");
const delete_reply_1 = require("./controllers/threads/replies/delete-reply");
const edit_reply_1 = require("./controllers/threads/replies/edit-reply");
const like_reply_1 = require("./controllers/threads/replies/like-reply");
const unlike_reply_1 = require("./controllers/threads/replies/unlike-reply");
const delete_workout_1 = require("./controllers/workouts/delete-workout");
const get_workout_1 = require("./controllers/workouts/get-workout");
const workout_history_1 = require("./controllers/workouts/workout-history");
const get_all_exercises_1 = require("./controllers/exercises/get-all-exercises");
const get_exercise_1 = require("./controllers/exercises/get-exercise");
const workout_stats_1 = require("./controllers/workouts/workout-stats");
const save_workout_1 = require("./controllers/workouts/save-workout");
const workout_suggestion_1 = require("./controllers/workouts/workout-suggestion");
const get_profile_1 = require("./controllers/profiles/get-profile");
const get_profile_by_id_1 = require("./controllers/profiles/get-profile-by-id");
const get_all_profiles_1 = require("./controllers/profiles/get-all-profiles");
const get_profile_threads_1 = require("./controllers/profiles/get-profile-threads");
const get_profile_replies_1 = require("./controllers/profiles/get-profile-replies");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (_req, res) => res.send("API running: "));
// OTHER ROUTES
app.get("/auth/check", requireLoggedIn_1.requireLoggedIn, (_req, res) => { res.status(200).json({ user: _req.user }); });
///////////////////////
// LOGGED OUT ROUTES //
///////////////////////
app.post("/auth/login", requireLoggedOut_1.requireLoggedOut, login_1.loginController);
app.post("/auth/register", requireLoggedOut_1.requireLoggedOut, register_1.registerController);
app.post("/auth/forgot-password", requireLoggedOut_1.requireLoggedOut, (0, ipLimiter_1.ipLimiter)("If an account exists, your verification code has been sent."), forgot_password_1.forgotPasswordController);
app.post("/auth/forgot-password/verify", requireLoggedOut_1.requireLoggedOut, forgot_password_verify_otp_1.forgotPasswordVerifyOtpController);
app.post("/auth/forgot-password/reset", requireLoggedOut_1.requireLoggedOut, forgot_password_reset_1.forgotPasswordResetController);
app.post("/auth/email-verification", requireLoggedOut_1.requireLoggedOut, (0, ipLimiter_1.ipLimiter)("If an account exists, your verification code has been sent."), email_verification_1.emailVerificationController);
app.post("/auth/email-verification/verify", requireLoggedOut_1.requireLoggedOut, email_verification_verify_otp_1.emailVerificationVerifyOtpController);
//////////////////////
// LOGGED IN ROUTES //
//////////////////////
// SETTINGS
app.put("/settings/change-details", requireLoggedIn_1.requireLoggedIn, change_details_1.changeDetailsController);
app.put("/settings/change-password", requireLoggedIn_1.requireLoggedIn, change_password_1.changePasswordController);
app.put("/settings/change-username", requireLoggedIn_1.requireLoggedIn, change_username_1.changeUsernameController);
app.put("/settings/change-avatar", requireLoggedIn_1.requireLoggedIn, changeAvatarMiddleware_1.changeAvatarMiddleware.single("avatar"), change_avatar_1.changeAvatarController);
// PROFILES
app.get("/profiles/me", requireLoggedIn_1.requireLoggedIn, get_profile_1.getProfileController);
app.get("/profiles/:userId/threads", requireLoggedIn_1.requireLoggedIn, get_profile_threads_1.getProfileThreadsController);
app.get("/profiles/:userId/replies", requireLoggedIn_1.requireLoggedIn, get_profile_replies_1.getProfileRepliesController);
app.get("/profiles/:userId", requireLoggedIn_1.requireLoggedIn, get_profile_by_id_1.getProfileByIdController);
app.get("/profiles", requireLoggedIn_1.requireLoggedIn, get_all_profiles_1.getAllProfilesController);
// THREADS
app.post("/threads", requireLoggedIn_1.requireLoggedIn, create_thread_1.createThreadController);
app.delete("/threads/:threadId", requireLoggedIn_1.requireLoggedIn, delete_thread_1.deleteThreadController);
app.patch("/threads/:threadId", requireLoggedIn_1.requireLoggedIn, edit_thread_1.editThreadController);
app.get("/threads", requireLoggedIn_1.requireLoggedIn, get_all_threads_1.getAllThreadsController);
app.get("/threads/:threadId", requireLoggedIn_1.requireLoggedIn, get_thread_1.getThreadController);
app.post("/threads/:threadId/like", requireLoggedIn_1.requireLoggedIn, like_thread_1.likeThreadController);
app.delete("/threads/:threadId/like", requireLoggedIn_1.requireLoggedIn, unlike_thread_1.unlikeThreadController);
// REPLIES
app.post("/reply/:threadId", requireLoggedIn_1.requireLoggedIn, create_reply_1.createReplyController);
app.delete("/reply/:replyId", requireLoggedIn_1.requireLoggedIn, delete_reply_1.deleteReplyController);
app.patch("/reply/:replyId", requireLoggedIn_1.requireLoggedIn, edit_reply_1.editReplyController);
app.post("/reply/:replyId/like", requireLoggedIn_1.requireLoggedIn, like_reply_1.likeReplyController);
app.delete("/reply/:replyId/like", requireLoggedIn_1.requireLoggedIn, unlike_reply_1.unlikeReplyController);
// WORKOUTS
app.post("/workouts", requireLoggedIn_1.requireLoggedIn, save_workout_1.saveWorkoutController);
app.delete("/workouts/delete/:workoutId", requireLoggedIn_1.requireLoggedIn, delete_workout_1.deleteWorkoutController);
app.get("/workouts/:workoutId", requireLoggedIn_1.requireLoggedIn, get_workout_1.getWorkoutController);
app.get("/workouts-history", requireLoggedIn_1.requireLoggedIn, workout_history_1.workoutHistoryController);
app.get("/workouts-stats", requireLoggedIn_1.requireLoggedIn, workout_stats_1.workoutStatsController);
app.get("/workouts-suggestion/:exerciseId", requireLoggedIn_1.requireLoggedIn, workout_suggestion_1.workoutSuggestionController);
// EXERCISES
app.get("/exercises", requireLoggedIn_1.requireLoggedIn, get_all_exercises_1.getAllExercisesController);
app.get("/exercises/:exerciseId", requireLoggedIn_1.requireLoggedIn, get_exercise_1.getExerciseController);
// TESTING POSE DETECTION
app.post("/pushup", uploadVideo_1.uploadVideo.single("video"), poseController_1.analyzePushupVideo);
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "public", "uploads")));
app.use((err, _req, res, next) => {
    // MULTER ERROR FOR WHEN FILE IS TOO LARGE
    if (err instanceof multer_1.default.MulterError) {
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
app.use((err, _req, res, _next) => {
    console.error("UNHANDLED ERROR:", err);
    res.status(err.statusCode || 500).json({
        message: "Something went wrong. Please try again.",
    });
});
(0, emailLimiterCleanup_1.emailLimiterCleanup)();
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Node.JS Server running: http://localhost:${port}`));
