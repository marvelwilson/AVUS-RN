export function safeStringify(value: unknown, indent = 2): string {
    return JSON.stringify(
        value,
        (_key, val) => (typeof val === "bigint" ? val.toString() : val),
        indent,
    );
}