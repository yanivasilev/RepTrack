import { calculateAge } from "../../libs/helpers/calculateAge";

export function validateDob(dob: Date | undefined): string | null {
    if (!dob) return "Date of birth is required.";
    if (calculateAge(dob) < 18) return "You must be 18 or over.";
    if (calculateAge(dob) > 120) return "Age looks invalid.";

    return null;
}
