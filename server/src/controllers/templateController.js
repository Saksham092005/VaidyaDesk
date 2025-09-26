import { StatusCodes } from "http-status-codes";

import { createTemplateForUser, listTemplatesForUser } from "../services/templateService.js";
import { validateTemplatePayload, validateTemplateQuery } from "../validations/templateValidation.js";

export const listTemplates = async (req, res, next) => {
	try {
		const query = validateTemplateQuery(req.query);
		const templates = await listTemplatesForUser(req.user, query);
		res.status(StatusCodes.OK).json({
			success: true,
			data: templates,
		});
	} catch (error) {
		next(error);
	}
};

export const createTemplate = async (req, res, next) => {
	try {
		const payload = validateTemplatePayload(req.body);
		const template = await createTemplateForUser(req.user, payload);
		res.status(StatusCodes.CREATED).json({
			success: true,
			data: template,
		});
	} catch (error) {
		next(error);
	}
};
