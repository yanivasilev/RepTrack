export function formatDigitsToTime(digits: string) {
    let d = digits.replace(/\D/g, "").slice(0, 6);
    d = d.replace(/^0+/, "");
    if (!d) return "";

    if (d.length === 1) return `0:0${d}`;
    if (d.length === 2) return `0:${d}`;

    if (d.length <= 4) {
        const ss = d.slice(-2);
        const mm = d.slice(0, -2);
        return `${Number(mm)}:${ss}`;
    }

    const ss = d.slice(-2);
    const mm = d.slice(-4, -2);
    const hh = d.slice(0, -4);
    return `${Number(hh)}:${mm}:${ss}`;
}
