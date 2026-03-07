import { Badge } from "../types/badges/Badge";

export function getBadgeShortLabel(type: Badge["type"]) {
    if (type === "FIRST_WORKOUT") return "1ST";
    if (type.startsWith("WORKOUTS_")) return type.replace("WORKOUTS_", "");
    if (type.startsWith("TOTAL_")) return type.replace("TOTAL_", "").replace("_HOURS", "H");
    if (type.startsWith("STREAK_")) return `${type.replace("STREAK_", "")}D`;
    if (type.startsWith("VOLUME_")) return type.replace("VOLUME_", "");
    return "";
}