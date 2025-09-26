import { StatusCodes } from "http-status-codes";

import * as authService from "../services/authService.js";

export const register = async (req, res, next) => {
	try {
		const result = await authService.register(req.body);
		res.status(StatusCodes.CREATED).json({
			success: true,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};

export const login = async (req, res, next) => {
	try {
		const result = await authService.login(req.body);
		res.status(StatusCodes.OK).json({
			success: true,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};
