export function validateSex(sex: string | null): string | null {
    if (!sex) return "Sex is required.";
    if (sex !== "MALE" && sex !== "FEMALE") return "Sex is invalid.";

    return null;
}
