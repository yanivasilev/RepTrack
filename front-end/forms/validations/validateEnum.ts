type EnumLike = readonly { value: string }[];

export function validateEnum<T extends EnumLike>(value: ing | undstrefined | null, options: T, label: string): string | null {
    const valid = options.map(o => o.value);

    if (!value) return `${label} is required.`;
    if (!valid.includes(value)) return `${label} is invalid.`;

    return null;
}
