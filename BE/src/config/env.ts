const required = [
    "MONGO_URI",
    "JWT_SECRET",
    "MAGIC_SECRET_KEY",
    "ZERODEV_RPC_TEST",
    "OPENAI_API_KEY",
    "GROK_API_KEY"
];

required.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`${key} is not defined.`);
    }
});

export const env = {
    PORT: process.env.PORT || 5000,

    MONGO_URI: process.env.MONGO_URI!,

    MAGIC_SECRET_KEY: process.env.MAGIC_SECRET_KEY!,

    JWT_SECRET: process.env.JWT_SECRET!,

    ZERODEV_RPC: process.env.ZERODEV_RPC || process.env.ZERODEV_RPC_TEST,

    JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000, // 7 days in milliseconds

    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,

    GROK_API_KEY: process.env.GROK_API_KEY!,

    GEMINI_API_KEY: process.env.GEMINI_API_KEY!,

    ALCHEMY_NOTIFY_TOKEN: process.env.ALCHEMY_NOTIFY_TOKEN || "",

    ALCHEMY_WEBHOOK_IDS: process.env.ALCHEMY_WEBHOOK_IDS || "{}",

    ALCHEMY_WEBHOOK_SIGNING_KEYS: process.env.ALCHEMY_WEBHOOK_SIGNING_KEYS || "{}",

};
