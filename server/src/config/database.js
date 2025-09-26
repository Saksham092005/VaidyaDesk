import mongoose from "mongoose";
import { env } from "./env.js";
import logger from "../utils/logger.js";

let connectionPromise;

export const connectDatabase = async () => {
	if (connectionPromise) return connectionPromise;

	try {
		connectionPromise = mongoose.connect(env.mongoUri, {
			serverSelectionTimeoutMS: 5000,
		});

		await connectionPromise;
		logger.info("Connected to MongoDB");
	} catch (error) {
		logger.error("MongoDB connection error", error);
		process.exit(1);
	}

	return connectionPromise;
};

export const disconnectDatabase = async () => {
	if (!mongoose.connection.readyState) return;
	await mongoose.disconnect();
};
