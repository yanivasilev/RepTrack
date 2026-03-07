export function labelFor30Days(d: Date, prev?: Date) {
    const day = String(d.getDate()).padStart(2, "0");

    const monthChanged = prev && d.getMonth() !== prev.getMonth();
    if (d.getDate() === 1 || monthChanged) {
        return d.toLocaleDateString("en-GB", { month: "short", day: "2-digit" });
    }

    return day;
}