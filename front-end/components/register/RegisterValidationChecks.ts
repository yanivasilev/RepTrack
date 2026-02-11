import { validateEmail } from "../../forms/validations/validateEmail";
import { validateEnum } from "../../forms/validations/validateEnum";
import { validatePassword } from "../../forms/validations/validatePassword";
import { FITNESS_GOALS } from "../../libs/catalogs/register";
import { calculateAge } from "../../libs/helpers/calculateAge";
import { RegisterFormData } from "./RegisterForm";
import { Errors } from "./SubmitRegisterForm";

export function RegisterValidationChecks(data: RegisterFormData) {
    const errors: Errors = {};

    // EMAIL VALIDATION CHECKS
    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;

    // PASSWORD VALIDATION CHECKS
    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;

    // RE-PASSWORD VALIDATION CHECKS
    if (data.confirmPassword.length === 0)
        errors.confirmPassword = "Confirm password is required.";
    else if (data.password !== data.confirmPassword)
        errors.confirmPassword = "Password and confirm password must match.";

    // USERNAME VALIDATION CHECKS
    const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])?$/;

    if (data.username.length === 0) errors.username = "Username is required.";
    else if (data.username.length < 3)
        errors.username = "Username must be at least 3 characters.";
    else if (data.username.length > 20)
        errors.username = "Username must not exceed 20 characters.";
    else if (!usernameRegex.test(data.username))
        errors.username =
            "Username can only contain letters, numbers, '.' and '_'.";

    // DOB VALIDATION CHECKS
    if (!data.dob) errors.dob = "Date of birth is required.";
    else if (calculateAge(data.dob) < 18) errors.dob = "You must be 18 or over.";
    else if (calculateAge(data.dob) > 120) errors.dob = "Age looks invalid.";

    // SEX VALIDATION CHECKS
    if (!data.sex) errors.sex = "Sex is required.";

    // HEIGHT VALIDATION CHECKS
    const height = Number(data.height);

    if (!data.height) errors.height = "Height is required.";
    else if (Number.isNaN(height)) errors.height = "Height must be a number.";
    else if (!Number.isInteger(height))
        errors.height = "Height must be a whole number.";
    else {
        const heightInCm =
            data.heightUnitType === "IMPERIAL" ? Math.round(height * 30.48) : height;

        if (heightInCm < 50) errors.height = "Height looks too small.";
        else if (heightInCm > 272) errors.height = "Height looks too large.";
    }

    // WEIGHT VALIDATION CHECKS
    const weight = Number(data.weight);

    if (!data.weight) errors.weight = "Weight is required.";
    else if (Number.isNaN(weight)) errors.weight = "Weight must be a number.";
    else if (!Number.isInteger(weight))
        errors.weight = "Weight must be a whole number.";
    else {
        const weightInKg =
            data.weightUnitType === "IMPERIAL"
                ? Math.round(weight * 0.453592)
                : weight;

        if (weightInKg < 20) errors.weight = "Weight looks too small.";
        else if (weightInKg > 635) errors.weight = "Weight looks too large.";
    }

    // FITNESS GOAL VALIDATION CHECKS
    if (!data.fitnessGoal) errors.fitnessGoal = "Fitness goal is required.";

    // EXPERIENCE LEVEL VALIDATION CHECKS
    if (!data.experienceLevel)
        errors.experienceLevel = "Experience level is required.";

    // TRAINING STYLE VALIDATION CHECKS
    if (!data.trainingStyle) errors.trainingStyle = "Training style is required.";

    // TRAINING FREQUENCY VALIDATION CHECKS
    if (!data.trainingFrequency)
        errors.trainingFrequency = "Training frequency is required.";

    // HEIGHT UNIT VALIDATION CHECKS
    if (!data.heightUnitType)
        errors.heightUnitType = "Height unit is required.";

    // WEIGHT UNIT VALIDATION CHECKS
    if (!data.weightUnitType)
        errors.weightUnitType = "Weight unit is required.";

    return errors;
}