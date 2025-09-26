import { AppError } from "../utils/errorTypes.js";
import logger from "../utils/logger.js";

export const notFoundHandler = (req, res, next) => {
	next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

export const errorHandler = (err, req, res, _next) => {
	const statusCode = err instanceof AppError ? err.statusCode : 500;
	const message = err.message || "Internal server error";

	if (statusCode >= 500) {
		logger.error(message, err);
	} else {
		logger.warn(message, err.details ?? err);
	}

	res.status(statusCode).json({
		success: false,
		message,
		...(err.details ? { details: err.details } : {}),
	});
};
