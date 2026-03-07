export function cmToFt(cm: number) {
    const totalIn = cm / 2.54;
    let ft = Math.floor(totalIn / 12);
    let inch = Math.round(totalIn - ft * 12);

    if (inch === 12) {
        ft += 1;
        inch = 0;
    }

    return { ft, inch };
}