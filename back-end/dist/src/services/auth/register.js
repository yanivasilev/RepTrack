"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = registerService;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../db");
const email_verification_1 = require("./email-verification/email-verification");
async function registerService(data) {
    const existingEmail = await db_1.prisma.user.findUnique({ where: { email: data.email } });
    if (existingEmail)
        return { status: "email_taken" };
    if (data.password !== data.confirmPassword)
        return { status: "password_mismatch" };
    const existingUsername = await db_1.prisma.user.findUnique({ where: { username: data.username } });
    if (existingUsername)
        return { status: "username_taken" };
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    await db_1.prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            username: data.username,
            dob: data.dob,
            sex: data.sex,
            height: data.height,
            weight: data.weight,
            fitnessGoal: data.fitnessGoal,
            experienceLevel: data.experienceLevel,
            trainingStyle: data.trainingStyle,
            trainingFrequency: data.trainingFrequency,
            heightUnitType: data.heightUnitType,
            weightUnitType: data.weightUnitType
        },
    });
    try {
        await (0, email_verification_1.emailVerificationService)(data.email);
    }
    catch (error) {
        console.error("Failed to send verification email after register:", error);
    }
    return { status: "ok" };
}
