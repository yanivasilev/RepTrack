import axios from "axios";
import { RegisterFormData } from "../../../components/register/RegisterForm";

type RegisterPayload = {
    email: string;
    confirmPassword: string;
    password: string;
    username: string;
    dob?: string;
    sex: "MALE" | "FEMALE"
    height: number;
    weight: number;
    fitnessGoal: string;
    experienceLevel: string;
    trainingStyle: string;
    trainingFrequency: string;
    heightUnitType: string;
    weightUnitType: string;
};

type RegisterApiResponse = {
    accessToken: string;
    userId: string;
};

// CUSTOM ERROR  TYPE SO UI CAN SHOW THE ERRORS + MESSAGES FROM API
export class ApiError extends Error {
    fieldErrors?: Record<string, string>;
    status?: number;

    constructor(message: string, opts?: { fieldErrors?: Record<string, string>; status?: number }) {
        super(message);
        this.name = "ApiError";
        this.fieldErrors = opts?.fieldErrors;
        this.status = opts?.status;
    }
}

export async function registerApi(data: RegisterFormData): Promise<RegisterApiResponse> {
    // CONVERTING HEIGHT/WEIGHT TO NUMBER
    const height = Number(data.height);
    const weight = Number(data.weight);

    const payload: RegisterPayload = {
        email: data.email.trim(),
        confirmPassword: data.confirmPassword,
        password: data.password,
        username: data.username.trim(),
        dob: data.dob ? data.dob.toISOString() : undefined,
        sex: data.sex!,
        height,
        weight,
        fitnessGoal: data.fitnessGoal!,
        experienceLevel: data.experienceLevel!,
        trainingStyle: data.trainingStyle!,
        trainingFrequency: data.trainingFrequency!,
        heightUnitType: data.heightUnitType!,
        weightUnitType: data.weightUnitType!,
    };

    console.log("\x1b[42m POST \x1b[0m /auth/register PAYLOAD:", payload);

    try {
        const res = await axios.post<RegisterApiResponse>(
            "http://192.168.1.146:3000/auth/register",
            payload,
            {
                headers: { "Content-Type": "application/json" },
                timeout: 15000,
            }
        );

        console.log("\x1b[43m STATUS \x1b[0m", res.status);
        console.log("\x1b[43m DATA \x1b[0m", res.data);

        return res.data;
    } catch (e: any) {
        const status = e?.response?.status;
        const json = e?.response?.data;

        console.log("\x1b[41m REGISTER ERROR STATUS \x1b[0m", status);
        console.log("\x1b[41m REGISTER ERROR \x1b[0m", json);

        // IF BACKEND SENDS ZOD ERRORS:
        if (json?.errors?.length) {
            const fieldErrors: Record<string, string> = {};

            for (const e of json.errors) {
                if (!fieldErrors[e.field]) fieldErrors[e.field] = e.message;
            }

            throw new ApiError("Validation failed: ", { fieldErrors, status });
        }

        // FALL BACK ERROR MESSAGE
        const message = json?.message ?? e?.message ?? (status ? `Registration failed. (STATUS: ${status})` : "Registration failed.");

        throw new ApiError(message, { status });
    }
}
