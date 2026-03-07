export function labelForDay(d: Date) {
    return d.toLocaleDateString("en-GB", { weekday: "short" });
}