import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { register } from "./auth/register";
import { login } from "./auth/login";
import { forgotPassword } from "./auth/forgot-password";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("API running"));

app.post("/auth/register", register);
app.post("/auth/login", login);
app.post("/auth/forgot-password", forgotPassword);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Node.JS Server running: http://localhost:${port}`));