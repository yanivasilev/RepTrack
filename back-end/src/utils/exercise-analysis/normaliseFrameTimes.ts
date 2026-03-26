export function normaliseFrameTimes(frames: any[], fps: number) {
    // CHECKS IF FRAMES IS EMPTY
    if (!frames.length) return frames;

    // IF t IS MISSING OR NOT A NUMBER, REBUILD FROM INDEX
    if (typeof frames[0].t !== "number") return frames.map((f, i) => ({ ...f, t: i / fps }));

    const ts = frames.map((f) => f.t).filter((x: any) => typeof x === "number");
    const maxT = Math.max(...ts);

    // IF maxT IS BIG ITS MILLISECONDS
    if (maxT > 1000) return frames.map((f) => ({ ...f, t: f.t / 1000 }));

    // IF IT LOOKS LIKE FRAMCE INDICES (0..N)
    if (maxT > 10 && maxT <= frames.length + 5) return frames.map((f, i) => ({ ...f, t: i / fps }));

    // OTHERWISE ALREADY SECONDS
    return frames;
}