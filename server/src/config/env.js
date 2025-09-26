import path from "node:path";
import dotenv from "dotenv";

const envFile = process.env.ENV_FILE || ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const parseNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
    port: parseNumber(process.env.PORT, 5000),
    mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/vaidya_desk",
    corsOrigins: (process.env.CORS_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean),
    jwt: {
        secret: process.env.JWT_SECRET || "change-me-in-production",
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
};
