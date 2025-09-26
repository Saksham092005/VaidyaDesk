import { StatusCodes } from "http-status-codes";

import {
	getPatientDashboard,
	listPatientAppointments,
	createPatientAppointmentRequest,
} from "../services/schedulingService.js";
import {
	extractPatientIdParam,
	validatePatientAppointmentQuery,
	validatePatientCreateAppointmentPayload,
} from "../validations/schedulingValidation.js";

export const getOwnDashboard = async (req, res, next) => {
	try {
		const dashboard = await getPatientDashboard(req.user);
		res.status(StatusCodes.OK).json({
			success: true,
			data: dashboard,
		});
	} catch (error) {
		next(error);
	}
};

export const createOwnAppointmentRequest = async (req, res, next) => {
	try {
		const payload = validatePatientCreateAppointmentPayload(req.body);
		const appointment = await createPatientAppointmentRequest(req.user, payload);
		res.status(StatusCodes.CREATED).json({
			success: true,
			data: appointment,
		});
	} catch (error) {
		next(error);
	}
};

export const getDashboardByPatientId = async (req, res, next) => {
	try {
		const patientId = extractPatientIdParam(req.params);
		const dashboard = await getPatientDashboard(req.user, patientId);
		res.status(StatusCodes.OK).json({
			success: true,
			data: dashboard,
		});
	} catch (error) {
		next(error);
	}
};

export const listOwnAppointments = async (req, res, next) => {
	try {
		const filters = validatePatientAppointmentQuery(req.query);
		const appointments = await listPatientAppointments(req.user, filters);
		res.status(StatusCodes.OK).json({
			success: true,
			data: appointments,
		});
	} catch (error) {
		next(error);
	}
};

export const listAppointmentsByPatientId = async (req, res, next) => {
	try {
		const patientId = extractPatientIdParam(req.params);
		const filters = validatePatientAppointmentQuery(req.query);
		const appointments = await listPatientAppointments(req.user, { ...filters, patientId });
		res.status(StatusCodes.OK).json({
			success: true,
			data: appointments,
		});
	} catch (error) {
		next(error);
	}
};
