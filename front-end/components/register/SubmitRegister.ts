import { submitForm } from "../../forms/submitForm";
import { validateEmail } from "../../forms/validations/validateEmail";
import { validatePassword } from "../../forms/validations/validatePassword";
import { validateConfirmPassword } from "../../forms/validations/validateConfirmPassword";
import { RegisterApi, RegisterPayload } from "../../services/api/auth/registerApi";
import { validateUsername } from "../../forms/validations/validateUsername";
import { validateSex } from "../../forms/validations/validateSex.ts";
import { validateHeight } from "../../forms/validations/validateHeight";
import { validateWeight } from "../../forms/validations/validateWeight";
import { validateEnum } from "../../forms/validations/validateEnum";
import { EXPERIENCE_LEVEL, FITNESS_GOALS, TRAINING_FREQUENCY, TRAINING_STYLE, UNIT_TYPE } from "../../libs/catalogs/register";
import { validateDob } from "../../forms/validations/validateDob";

type Fields = keyof RegisterPayload;

type RegisterResponse =
    | { success: true; message: string }
    | { success: false; message: string; errors?: Partial<Record<Fields, string>> };

type ApiRes = { message?: string };

export async function SubmitRegister({ data }: { data: RegisterPayload }): Promise<RegisterResponse> {
    const result = await submitForm<RegisterPayload, Fields, ApiRes>({
        data,
        validate: (d) => {
            const errors: Partial<Record<Fields, string>> = {};

            const emailError = validateEmail(d.email);
            if (emailError) errors.email = emailError;

            const passwordError = validatePassword(d.password);
            if (passwordError) errors.password = passwordError;

            const confirmPassError = validateConfirmPassword(d.password, d.confirmPassword);
            if (confirmPassError) errors.confirmPassword = confirmPassError;

            const usernameError = validateUsername(d.username);
            if (usernameError) errors.username = usernameError;

            const dobError = validateDob(d.dob);
            if (dobError) errors.dob = dobError;

            const sexError = validateSex(d.sex);
            if (sexError) errors.sex = sexError;

            const heightError = validateHeight(d.height);
            if (heightError) errors.height = heightError;

            const weightNumber = d.weight ? Number(d.weight) : null;
            const weightError = validateWeight(weightNumber, d.weightUnitType);
            if (weightError) errors.weight = weightError;

            const heightUnitType = validateEnum(d.heightUnitType, UNIT_TYPE, "Height unit");
            if (heightUnitType) errors.heightUnitType = heightUnitType;

            const weightUnitTypeError = validateEnum(d.weightUnitType, UNIT_TYPE, "Weight unit");
            if (weightUnitTypeError) errors.weightUnitType = weightUnitTypeError;

            const fitnessGoalError = validateEnum(d.fitnessGoal, FITNESS_GOALS, "Fitness goal");
            if (fitnessGoalError) errors.fitnessGoal = fitnessGoalError;

            const experienceLevelError = validateEnum(d.experienceLevel, EXPERIENCE_LEVEL, "Experience level");
            if (experienceLevelError) errors.experienceLevel = experienceLevelError;

            const trainingStyleError = validateEnum(d.trainingStyle, TRAINING_STYLE, "Training style");
            if (trainingStyleError) errors.trainingStyle = trainingStyleError;

            const trainingFrequencyError = validateEnum(d.trainingFrequency, TRAINING_FREQUENCY, "Training frequency");
            if (trainingFrequencyError) errors.trainingFrequency = trainingFrequencyError;


            return Object.keys(errors).length ? errors : null;
        },
        apiCall: RegisterApi,
        successMessage: (res) => res?.message ?? "Registration was successful.",
        fallbackErrorMessage: "Register failed.",
    });

    return result;
}
