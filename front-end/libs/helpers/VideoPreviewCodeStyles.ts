export function VideoPreviewCodeStyles(code: string) {
    switch (code) {
        case "GOOD":
            return { bg: "#DCFCE7", fg: "#166534", border: "#86EFAC" };
        case "TOO_SHALLOW":
        case "BAD_PLANK":
        case "TOO_FAST":
        case "TOO_SLOW":
        case "NO_TRAVEL":
        case "LOW_CONFIDENCE":
            return { bg: "#FEF3C7", fg: "#92400E", border: "#FCD34D" };
        case "NOT_PUSHUP":
        case "NO_REPS":
            return { bg: "#FEE2E2", fg: "#991B1B", border: "#FCA5A5" };
        default:
            return { bg: "#E5E7EB", fg: "#111827", border: "#D1D5DB" };
    }
}
