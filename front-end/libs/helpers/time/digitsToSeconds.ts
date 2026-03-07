// PARSING WHAT HAS BEEN TYPED TO SECONDS SO IF 90 TO 1:30
export function digitsToSeconds(digits: string) {
    const d = digits.replace(/\D/g, "").replace(/^0+/, "");
    if (!d) return 0;

    if (d.length <= 2) return Number(d);

    if (d.length <= 4) {
        const ss = Number(d.slice(-2));
        const mm = Number(d.slice(0, -2));
        return mm * 60 + ss;
    }

    const ss = Number(d.slice(-2));
    const mm = Number(d.slice(-4, -2));
    const hh = Number(d.slice(0, -4));
    return hh * 3600 + mm * 60 + ss;
}