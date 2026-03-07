type ServerErrors = Partial<Record<string, string>>;
type ClientErrors = Partial<Record<string, string>>;

const clientKey = (exerciseId: string, setId: string, field: string) =>
    `exercisesById.${exerciseId}.setsById.${setId}.${field}`;

export function toClientErrors(session: any, serverErrors: ServerErrors): ClientErrors {
    const out: ClientErrors = {};
    if (!session) return out;

    for (const [path, message] of Object.entries(serverErrors ?? {})) {
        const m = path.match(/^exercises\.(\d+)\.sets\.(\d+)\.(reps|weight|durationSeconds)$/);
        if (!m) continue;

        const exIndex = Number(m[1]);
        const setIndex = Number(m[2]);
        const field = m[3];

        const ex = session.exercises?.[exIndex];
        const set = ex?.sets?.[setIndex];

        if (!ex || !set) continue;

        out[clientKey(String(ex.id), String(set.id), field)] = message!;
    }

    return out;
}
