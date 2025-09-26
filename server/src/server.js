import http from "node:http";

import app from "./app.js";
import { connectDatabase, env } from "./config/index.js";
import logger from "./utils/logger.js";

const server = http.createServer(app);

const start = async () => {
    try {
        await connectDatabase();

        server.listen(env.port, () => {
            logger.info(`Server running on port ${env.port}`);
        });
    } catch (error) {
        logger.error("Failed to start server", error);
        process.exit(1);
    }
};

const gracefulShutdown = (signal) => {
    process.on(signal, () => {
        logger.info(`${signal} received. Shutting down gracefully...`);
        server.close(() => {
            logger.info("HTTP server closed");
            process.exit(0);
        });
    });
};

["SIGINT", "SIGTERM"].forEach(gracefulShutdown);

start();
