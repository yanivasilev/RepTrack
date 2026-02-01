import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { register } from "./auth/register";
import { login } from "./auth/login";
import { forgotPassword } from "./auth/forgotPassword";
import { emailLimiterCleanup } from "./security/emailLimiterCleanup";
import { ipLimiter } from "./security/ipLimiter";
import { forgotPasswordVerify } from "./auth/forgotPasswordVerify";
import { forgotPasswordReset } from "./auth/forgotPasswordReset";
import { requireLoggedOut } from "./security/requireLoggedOut";
import { requireLoggedIn } from "./security/requireLoggedIn";
import { loginChangePassword } from "./auth/loginChangePassword";
import { loginChangeUsername } from "./auth/loginChangeUsername";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("API running: "));

// LOGED OUT ROUTES
app.post("/auth/register", requireLoggedOut, register);
app.post("/auth/login", requireLoggedOut, login);
app.post("/auth/forgot-password", requireLoggedOut, ipLimiter("If an account exists, your verification code has been sent."), forgotPassword);
app.post("/auth/forgot-password/verify", requireLoggedOut, forgotPasswordVerify);
app.post("/auth/forgot-password/reset", requireLoggedOut, forgotPasswordReset);

// LOGGED IN ROUTES
app.post("/auth/login/change-password", requireLoggedIn, loginChangePassword);
app.post("/auth/login/change-username", requireLoggedIn, loginChangeUsername);

emailLimiterCleanup();

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Node.JS Server running: http://localhost:${port}`));