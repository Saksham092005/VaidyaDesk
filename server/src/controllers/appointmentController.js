import { StatusCodes } from "http-status-codes";

import {
	createPractitionerAppointment,
	listPractitionerAppointments,
} from "../services/schedulingService.js";
import {
	validateAppointmentQuery,
	validateCreateAppointmentPayload,
} from "../validations/schedulingValidation.js";

export const createAppointment = async (req, res, next) => {
	try {
		const payload = validateCreateAppointmentPayload(req.body);
		const appointment = await createPractitionerAppointment(req.user, payload);
		res.status(StatusCodes.CREATED).json({
			success: true,
			data: appointment,
		});
	} catch (error) {
		next(error);
	}
};

export const listAppointments = async (req, res, next) => {
	try {
		const query = validateAppointmentQuery(req.query);
		const appointments = await listPractitionerAppointments(req.user, query);
		res.status(StatusCodes.OK).json({
			success: true,
			data: appointments,
		});
	} catch (error) {
		next(error);
	}
};
